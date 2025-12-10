export interface Env {
    DB: D1Database;
    STORAGE: R2Bucket;
    AI: Ai;
    OPENAI_API_KEY?: string;
    GOOGLE_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    CLOUDFLARE_API_TOKEN?: string;
}

interface AgentSession {
    id: string;
    project_name: string;
    status: 'initializing' | 'coding' | 'completed' | 'error';
    current_feature?: string;
    features_completed: number;
    features_total: number;
    created_at: string;
    updated_at: string;
}

interface AgentRequest {
    project_name: string;
    app_spec?: string;
    feature_list?: string[];
    max_iterations?: number;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

interface TimeEntry {
    id: string;
    started_at: number;
    ended_at?: number;
    seconds?: number;
    cost_usd?: number;
    note?: string;
}

interface ImageMeta {
    key: string;
    title?: string;
    alt?: string;
    tags?: string[];
    updated_at?: number;
}

const RATE_PER_HOUR_USD = 12;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const method = request.method;
        const pathname = url.pathname;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Initialize database
        if (pathname === '/api/init') {
            try {
                await env.DB.exec(`
                    CREATE TABLE IF NOT EXISTS agent_sessions (
                        id TEXT PRIMARY KEY,
                        project_name TEXT NOT NULL,
                        status TEXT NOT NULL DEFAULT 'initializing',
                        current_feature TEXT,
                        features_completed INTEGER DEFAULT 0,
                        features_total INTEGER DEFAULT 0,
                        app_spec TEXT,
                        feature_list TEXT,
                        created_at INTEGER DEFAULT (strftime('%s', 'now')),
                        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
                    );
                    CREATE TABLE IF NOT EXISTS chat_messages (
                        id TEXT PRIMARY KEY,
                        session_id TEXT,
                        role TEXT NOT NULL,
                        content TEXT NOT NULL,
                        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
                        FOREIGN KEY (session_id) REFERENCES agent_sessions(id)
                    );
                    CREATE INDEX IF NOT EXISTS idx_status ON agent_sessions(status);
                    CREATE INDEX IF NOT EXISTS idx_project_name ON agent_sessions(project_name);
                    CREATE INDEX IF NOT EXISTS idx_session_id ON chat_messages(session_id);
                    CREATE TABLE IF NOT EXISTS time_entries (
                        id TEXT PRIMARY KEY,
                        started_at INTEGER NOT NULL,
                        ended_at INTEGER,
                        seconds INTEGER,
                        cost_usd REAL,
                        note TEXT
                    );
                    CREATE TABLE IF NOT EXISTS image_meta (
                        key TEXT PRIMARY KEY,
                        title TEXT,
                        alt TEXT,
                        tags TEXT,
                        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
                    );
                `);
                return jsonResponse({ success: true, message: 'Database initialized' }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ success: false, error: error.message }, corsHeaders, 500);
            }
        }

        // Create new agent session
        if (pathname === '/api/sessions' && method === 'POST') {
            try {
                const body = await request.json() as AgentRequest;
                const id = crypto.randomUUID();
                const now = Math.floor(Date.now() / 1000);

                if (!body.project_name) {
                    return jsonResponse({ error: 'project_name is required' }, corsHeaders, 400);
                }

                await env.DB.prepare(`
                    INSERT INTO agent_sessions (id, project_name, status, app_spec, features_total, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    id,
                    body.project_name,
                    'initializing',
                    body.app_spec || '',
                    body.feature_list?.length || 0,
                    now,
                    now
                ).run();

                // Store feature list in R2
                if (body.feature_list && body.feature_list.length > 0) {
                    await env.STORAGE.put(
                        `agent-sessions/${id}/feature_list.json`,
                        JSON.stringify(body.feature_list),
                        {
                            httpMetadata: { contentType: 'application/json' },
                        }
                    );
                }

                return jsonResponse({ success: true, session_id: id }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to create session' }, corsHeaders, 500);
            }
        }

        // Get all sessions
        if (pathname === '/api/sessions' && method === 'GET') {
            try {
                const result = await env.DB.prepare('SELECT * FROM agent_sessions ORDER BY created_at DESC')
                    .all<AgentSession>();
                return jsonResponse({ sessions: result.results || [] }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to load sessions' }, corsHeaders, 500);
            }
        }

        // Get single session
        if (pathname.startsWith('/api/sessions/') && method === 'GET' && !pathname.includes('/messages') && !pathname.includes('/chat') && !pathname.includes('/run')) {
            try {
                const id = pathname.split('/api/sessions/')[1];
                const session = await env.DB.prepare('SELECT * FROM agent_sessions WHERE id = ?')
                    .bind(id)
                    .first<AgentSession>();

                if (!session) {
                    return jsonResponse({ error: 'Session not found' }, corsHeaders, 404);
                }

                // Get feature list from R2
                let featureList = null;
                try {
                    const featureListObj = await env.STORAGE.get(`agent-sessions/${id}/feature_list.json`);
                    if (featureListObj) {
                        featureList = JSON.parse(await featureListObj.text());
                    }
                } catch (e) {
                    // Feature list not found, that's okay
                }

                return jsonResponse({ session: { ...session, feature_list: featureList } }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to load session' }, corsHeaders, 500);
            }
        }

        // Get chat messages for session
        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/messages') && method === 'GET') {
            try {
                const id = pathname.split('/api/sessions/')[1].replace('/messages', '');
                const messages = await env.DB.prepare(`
                    SELECT * FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC
                `).bind(id).all<ChatMessage>();
                return jsonResponse({ messages: messages.results || [] }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to load messages' }, corsHeaders, 500);
            }
        }

        // Send chat message
        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/chat') && method === 'POST') {
            try {
                const id = pathname.split('/api/sessions/')[1].replace('/chat', '');
                const body = await request.json() as { message: string };

                if (!body.message) {
                    return jsonResponse({ error: 'message is required' }, corsHeaders, 400);
                }

                const messageId = crypto.randomUUID();
                const now = Math.floor(Date.now() / 1000);

                // Save user message
                await env.DB.prepare(`
                    INSERT INTO chat_messages (id, session_id, role, content, timestamp)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(messageId, id, 'user', body.message, now).run();

                // Get session context
                const session = await env.DB.prepare('SELECT * FROM agent_sessions WHERE id = ?')
                    .bind(id)
                    .first<AgentSession>();

                // Get recent chat history for context
                const recentMessages = await env.DB.prepare(`
                    SELECT role, content FROM chat_messages 
                    WHERE session_id = ? 
                    ORDER BY timestamp DESC 
                    LIMIT 10
                `).bind(id).all<{ role: string; content: string }>();

                // Process with AI (try Cloudflare AI first, then OpenAI, then Anthropic)
                let assistantResponse = 'I received your message. Processing with AI...';

                try {
                    // Try Cloudflare Workers AI
                    if (env.AI) {
                        const messages = [
                            ...recentMessages.results.reverse().map(m => ({
                                role: m.role === 'user' ? 'user' : 'assistant',
                                content: m.content
                            })),
                            { role: 'user' as const, content: body.message }
                        ];

                        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
                            messages: messages,
                            max_tokens: 1000
                        });

                        if (response && typeof response === 'object' && 'response' in response) {
                            assistantResponse = String(response.response);
                        } else if (typeof response === 'string') {
                            assistantResponse = response;
                        }
                    }
                } catch (cfError) {
                    console.error('Cloudflare AI error:', cfError);

                    // Fallback to OpenAI
                    if (env.OPENAI_API_KEY) {
                        try {
                            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${env.OPENAI_API_KEY}`
                                },
                                body: JSON.stringify({
                                    model: 'gpt-4',
                                    messages: [
                                        ...recentMessages.results.reverse().map(m => ({
                                            role: m.role === 'user' ? 'user' : 'assistant',
                                            content: m.content
                                        })),
                                        { role: 'user', content: body.message }
                                    ],
                                    max_tokens: 1000
                                })
                            });

                            if (openaiResponse.ok) {
                                const data = await openaiResponse.json();
                                assistantResponse = data.choices[0]?.message?.content || assistantResponse;
                            }
                        } catch (openaiError) {
                            console.error('OpenAI error:', openaiError);

                            // Fallback to Anthropic
                            if (env.ANTHROPIC_API_KEY) {
                                try {
                                    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-api-key': env.ANTHROPIC_API_KEY,
                                            'anthropic-version': '2023-06-01'
                                        },
                                        body: JSON.stringify({
                                            model: 'claude-3-5-sonnet-20241022',
                                            max_tokens: 1000,
                                            messages: [
                                                ...recentMessages.results.reverse().map(m => ({
                                                    role: m.role === 'user' ? 'user' : 'assistant',
                                                    content: m.content
                                                })),
                                                { role: 'user', content: body.message }
                                            ]
                                        })
                                    });

                                    if (anthropicResponse.ok) {
                                        const data = await anthropicResponse.json();
                                        assistantResponse = data.content[0]?.text || assistantResponse;
                                    }
                                } catch (anthropicError) {
                                    console.error('Anthropic error:', anthropicError);
                                }
                            }
                        }
                    }
                }

                // Save assistant response
                const assistantId = crypto.randomUUID();
                await env.DB.prepare(`
                    INSERT INTO chat_messages (id, session_id, role, content, timestamp)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(assistantId, id, 'assistant', assistantResponse, now + 1).run();

                return jsonResponse({
                    success: true,
                    message_id: assistantId,
                    response: assistantResponse
                }, corsHeaders);
            } catch (error: any) {
                console.error('Chat error:', error);
                return jsonResponse({ error: error.message || 'Failed to process chat message' }, corsHeaders, 500);
            }
        }

        // Time tracking: start
        if (pathname === '/api/time/start' && method === 'POST') {
            try {
                const running = await env.DB.prepare(`
                    SELECT * FROM time_entries WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1
                `).first<TimeEntry>();

                if (running) {
                    return jsonResponse({ running: true, started_at: running.started_at }, corsHeaders);
                }

                const id = crypto.randomUUID();
                const now = Math.floor(Date.now() / 1000);
                await env.DB.prepare(`
                    INSERT INTO time_entries (id, started_at) VALUES (?, ?)
                `).bind(id, now).run();

                return jsonResponse({ success: true, running: true, started_at: now }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to start timer' }, corsHeaders, 500);
            }
        }

        // Time tracking: stop
        if (pathname === '/api/time/stop' && method === 'POST') {
            try {
                const running = await env.DB.prepare(`
                    SELECT * FROM time_entries WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1
                `).first<TimeEntry>();

                if (!running) {
                    return jsonResponse({ running: false, message: 'No active timer' }, corsHeaders);
                }

                const now = Math.floor(Date.now() / 1000);
                const seconds = Math.max(0, now - running.started_at);
                const cost = (seconds / 3600) * RATE_PER_HOUR_USD;

                await env.DB.prepare(`
                    UPDATE time_entries SET ended_at = ?, seconds = ?, cost_usd = ? WHERE id = ?
                `).bind(now, seconds, cost, running.id).run();

                return jsonResponse({ success: true, running: false, seconds, cost }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to stop timer' }, corsHeaders, 500);
            }
        }

        // Time tracking: status
        if (pathname === '/api/time/status' && method === 'GET') {
            try {
                const now = Math.floor(Date.now() / 1000);
                const running = await env.DB.prepare(`
                    SELECT * FROM time_entries WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1
                `).first<TimeEntry>();

                const aggregates = await env.DB.prepare(`
                    SELECT
                        SUM(CASE WHEN date(started_at, 'unixepoch', 'localtime') = date('now', 'localtime') THEN COALESCE(seconds, (strftime('%s','now') - started_at)) ELSE 0 END) AS today_seconds,
                        SUM(CASE WHEN strftime('%W', started_at, 'unixepoch', 'localtime') = strftime('%W', 'now', 'localtime') THEN COALESCE(seconds, (strftime('%s','now') - started_at)) ELSE 0 END) AS week_seconds,
                        SUM(CASE WHEN strftime('%m', started_at, 'unixepoch', 'localtime') = strftime('%m', 'now', 'localtime') THEN COALESCE(seconds, (strftime('%s','now') - started_at)) ELSE 0 END) AS month_seconds
                    FROM time_entries
                `).first<{ today_seconds: number; week_seconds: number; month_seconds: number }>();

                const today = aggregates?.today_seconds || 0;
                const week = aggregates?.week_seconds || 0;
                const month = aggregates?.month_seconds || 0;

                return jsonResponse({
                    running: !!running,
                    started_at: running?.started_at || null,
                    seconds: running ? now - running.started_at : 0,
                    aggregates: {
                        today_seconds: today,
                        week_seconds: week,
                        month_seconds: month,
                        today_cost: (today / 3600) * RATE_PER_HOUR_USD,
                        week_cost: (week / 3600) * RATE_PER_HOUR_USD,
                        month_cost: (month / 3600) * RATE_PER_HOUR_USD,
                        rate_per_hour: RATE_PER_HOUR_USD,
                    },
                }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to load time status' }, corsHeaders, 500);
            }
        }

        // Images: list
        if (pathname === '/api/images' && method === 'GET') {
            try {
                const list = await env.STORAGE.list({ limit: 50 });
                const metas: Record<string, ImageMeta> = {};
                const keys = list.objects.map(o => o.key);

                if (keys.length > 0) {
                    const placeholders = keys.map(() => '?').join(',');
                    const metaRows = await env.DB.prepare(`SELECT * FROM image_meta WHERE key IN (${placeholders})`)
                        .bind(...keys)
                        .all<ImageMeta>();
                    (metaRows.results || []).forEach(m => {
                        metas[m.key] = {
                            key: m.key,
                            title: m.title,
                            alt: m.alt,
                            tags: m.tags ? JSON.parse(m.tags) : undefined,
                            updated_at: m.updated_at,
                        };
                    });
                }

                const data = list.objects.map(obj => ({
                    key: obj.key,
                    size: obj.size,
                    uploaded: obj.uploaded,
                    metadata: metas[obj.key] || null,
                }));

                return jsonResponse({ images: data }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to list images' }, corsHeaders, 500);
            }
        }

        // Images: update metadata
        if (pathname.startsWith('/api/images/') && pathname.endsWith('/metadata') && method === 'PUT') {
            try {
                const key = decodeURIComponent(pathname.replace('/api/images/', '').replace('/metadata', ''));
                const body = await request.json() as { title?: string; alt?: string; tags?: string[] };
                const now = Math.floor(Date.now() / 1000);

                await env.DB.prepare(`
                    INSERT INTO image_meta (key, title, alt, tags, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(key) DO UPDATE SET
                        title = excluded.title,
                        alt = excluded.alt,
                        tags = excluded.tags,
                        updated_at = excluded.updated_at
                `).bind(
                    key,
                    body.title || null,
                    body.alt || null,
                    body.tags ? JSON.stringify(body.tags) : null,
                    now
                ).run();

                return jsonResponse({ success: true }, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to update metadata' }, corsHeaders, 500);
            }
        }

        // Start/continue agent session
        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/run') && method === 'POST') {
            try {
                const id = pathname.split('/api/sessions/')[1].replace('/run', '');
                const session = await env.DB.prepare('SELECT * FROM agent_sessions WHERE id = ?')
                    .bind(id)
                    .first<AgentSession>();

                if (!session) {
                    return jsonResponse({ error: 'Session not found' }, corsHeaders, 404);
                }

                // Update status to coding
                await env.DB.prepare(`
                    UPDATE agent_sessions SET status = ?, updated_at = ? WHERE id = ?
                `).bind('coding', Math.floor(Date.now() / 1000), id).run();

                const response = {
                    success: true,
                    message: 'Agent session started',
                    session_id: id,
                    status: 'coding',
                    note: 'Agent is working on the project. Check status endpoint for updates.',
                };

                return jsonResponse(response, corsHeaders);
            } catch (error: any) {
                return jsonResponse({ error: error.message || 'Failed to start session' }, corsHeaders, 500);
            }
        }

        // Test API keys endpoint
        if (pathname === '/api/test-keys' && method === 'GET') {
            return jsonResponse({
                hasOpenAI: !!env.OPENAI_API_KEY,
                hasGoogle: !!env.GOOGLE_API_KEY,
                hasAnthropic: !!env.ANTHROPIC_API_KEY,
                hasCloudflareAI: !!env.AI,
                hasCloudflareToken: !!env.CLOUDFLARE_API_TOKEN
            }, corsHeaders);
        }

        // Serve home landing page
        if (pathname === '/home') {
            const html = getHomeHTML();
            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    ...corsHeaders,
                },
            });
        }

        const multiPagePaths = new Set([
            '/', '/index.html', '/home', '/dashboard', '/builder', '/designs', '/assets', '/api',
            '/dev', '/apps', '/dashboard/work', '/dashboard/work/projects', '/dashboard/work/board',
            '/dashboard/apps', '/dashboard/apps/photo', '/dashboard/chat', '/dashboard/chat/mail',
            '/dashboard/chat/meet', '/dashboard/auto', '/dashboard/auto/optimize', '/dashboard/dev',
            '/dashboard/dev/mcp', '/dashboard/dev/stripe', '/dashboard/dev/keys', '/dashboard/account/settings'
        ]);

        // Serve dashboard shell for multipage app
        if (multiPagePaths.has(pathname)) {
            const html = getDashboardHTML();
            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    ...corsHeaders,
                },
            });
        }

        return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
    },
} satisfies ExportedHandler<Env>;

function jsonResponse(data: any, headers: Record<string, string>, status = 200): Response {
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        status,
    });
}

function getDashboardHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Meauxbility Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --meaux-teal: #14b8a6;
            --meaux-teal-light: #5eead4;
            --meaux-teal-dark: #0d9488;
            --meaux-mint: #34d399;
            
            --bg-app: #0a0e1a;
            --bg-surface: #111827;
            --bg-surface-secondary: #1f2937;
            --bg-hover: #374151;
            --bg-active: rgba(20, 184, 166, 0.1);
            
            --text-primary: #f9fafb;
            --text-secondary: #9ca3af;
            --text-tertiary: #6b7280;
            
            --border: #374151;
            --border-hover: #4b5563;
            
            --sidebar-width: 280px;
            --topbar-height: 60px;
            --mobile-bottom-nav: 68px;
            
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }

        body {
            font-family: 'Inter', -apple-system, system-ui, sans-serif;
            background: var(--bg-app);
            color: var(--text-primary);
            overflow-x: hidden;
        }

        /* ==================== LAYOUT ==================== */
        .app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
        }

        /* ==================== TOPBAR ==================== */
        .topbar {
            height: var(--topbar-height);
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 20px;
            gap: 16px;
            z-index: 100;
        }

        .menu-toggle {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s ease;
        }

        .menu-toggle:hover {
            background: var(--bg-hover);
        }

        .menu-toggle svg {
            width: 24px;
            height: 24px;
            stroke: var(--text-primary);
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--meaux-teal) 0%, var(--meaux-mint) 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 16px;
            color: white;
        }

        .logo-text {
            font-size: 18px;
            font-weight: 700;
            display: none;
        }

        .search-container {
            flex: 1;
            max-width: 500px;
            position: relative;
        }

        .search-input {
            width: 100%;
            height: 40px;
            padding: 0 40px 0 40px;
            background: var(--bg-surface-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 14px;
            outline: none;
            transition: all 0.15s ease;
        }

        .search-input:focus {
            border-color: var(--meaux-teal);
            box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            stroke: var(--text-tertiary);
        }

        .search-results {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            max-height: 400px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
        }

        .search-results.active {
            display: block;
        }

        .search-result-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.15s ease;
            border-bottom: 1px solid var(--border);
        }

        .search-result-item:last-child {
            border-bottom: none;
        }

        .search-result-item:hover {
            background: var(--bg-hover);
        }

        .search-result-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
        }

        .search-result-desc {
            font-size: 12px;
            color: var(--text-tertiary);
        }

        .search-result-badge {
            display: inline-block;
            padding: 2px 8px;
            background: var(--bg-active);
            color: var(--meaux-teal-light);
            font-size: 11px;
            font-weight: 600;
            border-radius: 4px;
            margin-top: 4px;
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
        }

        .timer-widget {
            display: none;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--bg-surface-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            font-weight: 600;
            color: var(--meaux-teal-light);
        }

        .timer-dot {
            width: 6px;
            height: 6px;
            background: var(--meaux-teal);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.2); }
        }

        .icon-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s ease;
            position: relative;
        }

        .icon-btn:hover {
            background: var(--bg-hover);
        }

        .icon-btn svg {
            width: 20px;
            height: 20px;
            stroke: var(--text-secondary);
        }

        .notification-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            border: 2px solid var(--bg-surface);
        }

        /* ==================== SIDEBAR ==================== */
        .sidebar {
            position: fixed;
            left: 0;
            top: var(--topbar-height);
            bottom: 0;
            width: var(--sidebar-width);
            background: var(--bg-surface);
            border-right: 1px solid var(--border);
            padding: 24px 0;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 90;
        }

        .sidebar.open {
            transform: translateX(0);
        }

        .nav-section {
            margin-bottom: 32px;
            padding: 0 16px;
        }

        .nav-section-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-tertiary);
            padding: 0 12px;
            margin-bottom: 8px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.15s ease;
            cursor: pointer;
            position: relative;
        }

        .nav-item:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }

        .nav-item.active {
            background: var(--bg-active);
            color: var(--meaux-teal-light);
            font-weight: 600;
        }

        .nav-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            background: var(--meaux-teal);
            border-radius: 0 2px 2px 0;
        }

        .nav-icon {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            flex-shrink: 0;
        }

        .nav-badge {
            margin-left: auto;
            padding: 2px 8px;
            background: var(--meaux-teal);
            color: white;
            font-size: 11px;
            font-weight: 700;
            border-radius: 10px;
        }

        /* ==================== MOBILE BOTTOM NAV ==================== */
        .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: var(--mobile-bottom-nav);
            background: var(--bg-surface);
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 8px;
            z-index: 100;
        }

        .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            flex: 1;
            padding: 8px;
            border-radius: 8px;
            color: var(--text-tertiary);
            text-decoration: none;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.15s ease;
            position: relative;
        }

        .bottom-nav-item svg {
            width: 24px;
            height: 24px;
            stroke: currentColor;
        }

        .bottom-nav-item.active {
            color: var(--meaux-teal-light);
            background: var(--bg-active);
        }

        .bottom-nav-item.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 3px;
            background: var(--meaux-teal);
            border-radius: 0 0 3px 3px;
        }

        /* ==================== MAIN CONTENT ==================== */
        .section { display: none; }
        .section.active { display: block; }

        /* ==================== STAT CARDS ==================== */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.15s ease;
        }

        .stat-card:hover {
            border-color: var(--meaux-teal);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .stat-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-tertiary);
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 8px;
        }

        .stat-change {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .stat-change.positive {
            color: #10b981;
        }

        /* ==================== MOBILE OVERLAY ==================== */
        .mobile-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 80;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .mobile-overlay.active {
            display: block;
            opacity: 1;
        }

        /* ==================== RESPONSIVE ==================== */
        @media (min-width: 768px) {
            .logo-text {
                display: block;
            }

            .timer-widget {
                display: flex;
            }

            .mobile-bottom-nav {
                display: none;
            }

            .sidebar {
                transform: translateX(0);
            }

            .main-content {
                margin-left: var(--sidebar-width);
                padding-bottom: 24px;
            }
        }

        @media (min-width: 1024px) {
            .icon-grid {
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            }

            .asset-grid {
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Topbar -->
        <header class="topbar">
            <button class="menu-toggle" id="menuToggle">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>

            <div class="logo-section">
                <div class="logo-icon">M</div>
                <div class="logo-text">MEAUXBILITY</div>
            </div>

            <div class="search-container">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="search-input" id="searchInput" placeholder="Search pages, icons, assets...">
                <div class="search-results" id="searchResults"></div>
            </div>

            <div class="topbar-actions">
                <div class="timer-widget">
                    <div class="timer-dot"></div>
                    <span id="timer">00:00:00</span>
                </div>

                <button class="icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <span class="notification-badge"></span>
                </button>

                <button class="icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m5.2-13.8l-4.2 4.2m0 0l-4.2 4.2m10.2-2.4h-6m-6 0H1m5.8 5.2l4.2-4.2m0 0l4.2-4.2"/>
                    </svg>
                </button>
            </div>
        </header>

        <!-- Mobile Overlay -->
        <div class="mobile-overlay" id="mobileOverlay"></div>

        <!-- Sidebar -->
        <nav class="sidebar" id="sidebar">
            <div class="nav-section">
                <div class="nav-section-label">Main</div>
                <a href="#dashboard" class="nav-item" data-page="dashboard">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                    </svg>
                    Dashboard
                </a>
                <a href="#builder" class="nav-item" data-page="builder">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Builder
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-label">Creative</div>
                <a href="#designs" class="nav-item" data-page="designs">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Designs
                </a>
                <a href="#assets" class="nav-item" data-page="assets">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    Assets
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-label">Developer</div>
                <a href="#dev" class="nav-item active" data-page="dev">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                    </svg>
                    Dev Tools
                    <span class="nav-badge">NEW</span>
                </a>
                <a href="#api" class="nav-item" data-page="api">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                    API Keys
                </a>
            </div>
        </nav>

        <!-- Mobile Bottom Nav -->
        <nav class="mobile-bottom-nav">
            <a href="#dashboard" class="bottom-nav-item" data-page="dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
                <span>Home</span>
            </a>

            <a href="#builder" class="bottom-nav-item" data-page="builder">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Build</span>
            </a>

            <a href="#designs" class="bottom-nav-item" data-page="designs">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Design</span>
            </a>

            <a href="#dev" class="bottom-nav-item active" data-page="dev">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                </svg>
                <span>Dev</span>
            </a>
        </nav>

        <!-- Main Content -->
        <main class="main-content" id="mainContent">
            <!-- Dev Tools Page -->
            <div class="page-header">
                <h1 class="page-title">Developer Tools</h1>
                <p class="page-subtitle">Icon library, asset preview, and development resources</p>
            </div>

            <div class="tabs-container">
                <button class="tab active" data-tab="icons">Icon Library</button>
                <button class="tab" data-tab="assets">Asset Preview</button>
                <button class="tab" data-tab="api">API Status</button>
                <button class="tab" data-tab="code">Code Snippets</button>
            </div>

            <!-- Icons Tab -->
            <div class="tab-content active" data-content="icons">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Total Icons</div>
                        <div class="stat-value">48</div>
                        <div class="stat-change">All SVG inline</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Categories</div>
                        <div class="stat-value">8</div>
                        <div class="stat-change">Navigation, Actions, UI</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Size</div>
                        <div class="stat-value">20px</div>
                        <div class="stat-change">Stroke width: 2</div>
                    </div>
                </div>

                <div class="icon-grid" id="iconGrid">
                    <!-- Icons will be generated by JavaScript -->
                </div>
            </div>

            <!-- Assets Tab -->
            <div class="tab-content" data-content="assets">
                <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
                    <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <div class="upload-text">Drop files here or click to upload</div>
                    <div class="upload-subtext">PNG, JPG, SVG, GIF up to 10MB</div>
                </div>
                <input type="file" id="fileInput" style="display: none;" multiple accept="image/*">

                <div class="asset-grid" id="assetGrid">
                    <!-- Example assets -->
                    <div class="asset-card">
                        <div class="asset-preview">
                            <svg class="asset-placeholder" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                        <div class="asset-info">
                            <div class="asset-name">logo-meaux.svg</div>
                            <div class="asset-meta">
                                <span>SVG</span>
                                <span>2.4 KB</span>
                            </div>
                        </div>
                    </div>

                    <div class="asset-card">
                        <div class="asset-preview">
                            <svg class="asset-placeholder" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                        <div class="asset-info">
                            <div class="asset-name">dashboard-preview.png</div>
                            <div class="asset-meta">
                                <span>PNG</span>
                                <span>128 KB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- API Status Tab -->
            <div class="tab-content" data-content="api">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">OpenAI</div>
                        <div class="stat-value" style="font-size: 24px; color: var(--meaux-teal-light);">✓ Active</div>
                        <div class="stat-change positive">↑ 847K requests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Claude</div>
                        <div class="stat-value" style="font-size: 24px; color: var(--meaux-teal-light);">✓ Active</div>
                        <div class="stat-change positive">↑ 523K requests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Cursor</div>
                        <div class="stat-value" style="font-size: 24px; color: var(--meaux-teal-light);">✓ Active</div>
                        <div class="stat-change positive">↑ 342K requests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Resend</div>
                        <div class="stat-value" style="font-size: 24px; color: var(--meaux-teal-light);">✓ Active</div>
                        <div class="stat-change positive">↑ 12.4K emails</div>
                    </div>
                </div>
            </div>

            <!-- Code Snippets Tab -->
            <div class="tab-content" data-content="code">
                <h3 style="margin-bottom: 16px; color: var(--text-primary); font-size: 18px;">Icon Usage</h3>
                <div class="code-block">
                    <pre>&lt;svg class="nav-icon" viewBox="0 0 24 24"&gt;
  &lt;rect x="3" y="3" width="7" height="7" rx="1"/&gt;
  &lt;rect x="14" y="3" width="7" height="7" rx="1"/&gt;
  &lt;rect x="14" y="14" width="7" height="7" rx="1"/&gt;
  &lt;rect x="3" y="14" width="7" height="7" rx="1"/&gt;
&lt;/svg&gt;</pre>
                </div>

                <h3 style="margin: 32px 0 16px; color: var(--text-primary); font-size: 18px;">CSS Styling</h3>
                <div class="code-block">
                    <pre>.nav-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}</pre>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Icon Library Data
        const icons = [
            { name: 'dashboard', svg: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' },
            { name: 'layers', svg: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>' },
            { name: 'folder', svg: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
            { name: 'star', svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
            { name: 'image', svg: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>' },
            { name: 'message', svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
            { name: 'mail', svg: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
            { name: 'code', svg: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
            { name: 'key', svg: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>' },
            { name: 'lightning', svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
            { name: 'settings', svg: '<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.2-13.8l-4.2 4.2m0 0l-4.2 4.2m10.2-2.4h-6m-6 0H1m5.8 5.2l4.2-4.2m0 0l4.2-4.2"/>' },
            { name: 'menu', svg: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>' },
            { name: 'search', svg: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
            { name: 'bell', svg: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
            { name: 'user', svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
            { name: 'chevron-down', svg: '<polyline points="6 9 12 15 18 9"/>' },
            { name: 'upload', svg: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>' },
            { name: 'download', svg: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' },
            { name: 'plus', svg: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' },
            { name: 'trash', svg: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' },
            { name: 'edit', svg: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
            { name: 'copy', svg: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' },
            { name: 'check', svg: '<polyline points="20 6 9 17 4 12"/>' },
            { name: 'x', svg: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
            { name: 'link', svg: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
            { name: 'eye', svg: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
            { name: 'clock', svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
            { name: 'calendar', svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
            { name: 'target', svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
            { name: 'activity', svg: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
            { name: 'users', svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
            { name: 'database', svg: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
            { name: 'box', svg: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
            { name: 'dollar', svg: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
            { name: 'chart', svg: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
            { name: 'trending-up', svg: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>' },
            { name: 'filter', svg: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' },
            { name: 'refresh', svg: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>' },
            { name: 'play', svg: '<polygon points="5 3 19 12 5 21 5 3"/>' },
            { name: 'pause', svg: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>' },
            { name: 'share', svg: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' },
            { name: 'bookmark', svg: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' },
            { name: 'heart', svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
            { name: 'grid', svg: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
            { name: 'list', svg: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
            { name: 'lock', svg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
            { name: 'unlock', svg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>' },
        ];

        // Search Data
        const searchData = [
            { title: 'Dashboard', desc: 'Overview and stats', badge: 'Main', page: 'dashboard' },
            { title: 'Builder', desc: 'Build with AI assistance', badge: 'Main', page: 'builder' },
            { title: 'Dev Tools', desc: 'Icon library and assets', badge: 'Developer', page: 'dev' },
            { title: 'API Keys', desc: 'Manage API integrations', badge: 'Developer', page: 'api' },
            { title: 'Designs', desc: 'Creative projects', badge: 'Creative', page: 'designs' },
            { title: 'Assets', desc: 'Media library', badge: 'Creative', page: 'assets' },
            ...icons.map(icon => ({ title: icon.name, desc: 'Icon', badge: 'Icon Library', page: 'dev' }))
        ];

        // Render Icon Library
        const iconGrid = document.getElementById('iconGrid');
        icons.forEach(icon => {
            const card = document.createElement('div');
            card.className = 'icon-card';
            card.innerHTML = \`
                <div class="icon-preview">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        \${icon.svg}
                    </svg>
                </div>
                <div class="icon-name">\${icon.name}</div>
                <div class="copy-badge">Click to Copy</div>
            \`;
            card.onclick = () => {
                const svgCode = \`<svg class="nav-icon" viewBox="0 0 24 24">\\n  \${icon.svg}\\n</svg>\`;
                navigator.clipboard.writeText(svgCode);
                card.querySelector('.copy-badge').textContent = 'Copied!';
                setTimeout(() => {
                    card.querySelector('.copy-badge').textContent = 'Click to Copy';
                }, 2000);
            };
            iconGrid.appendChild(card);
        });

        // Search Functionality
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length === 0) {
                searchResults.classList.remove('active');
                return;
            }

            const filtered = searchData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.desc.toLowerCase().includes(query)
            ).slice(0, 8);

            if (filtered.length > 0) {
                searchResults.innerHTML = filtered.map(item => \`
                    <div class="search-result-item" data-page="\${item.page}">
                        <div class="search-result-title">\${item.title}</div>
                        <div class="search-result-desc">\${item.desc}</div>
                        <span class="search-result-badge">\${item.badge}</span>
                    </div>
                \`).join('');
                searchResults.classList.add('active');

                // Add click handlers
                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const page = item.dataset.page;
                        navigateToPage(page);
                        searchInput.value = '';
                        searchResults.classList.remove('active');
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="search-result-item"><div class="search-result-title">No results found</div></div>';
                searchResults.classList.add('active');
            }
        });

        // Close search on click outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Navigation
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const navItems = document.querySelectorAll('.nav-item, .bottom-nav-item');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mobileOverlay.classList.toggle('active');
        });

        mobileOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('active');
        });

        function navigateToPage(page) {
            navItems.forEach(item => {
                if (item.dataset.page === page) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            if (window.innerWidth < 768) {
                sidebar.classList.remove('open');
                mobileOverlay.classList.remove('active');
            }
        }

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToPage(item.dataset.page);
            });
        });

        // Tabs
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                tabContents.forEach(content => {
                    if (content.dataset.content === target) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });

        // Timer
        let seconds = 0;
        const timer = document.getElementById('timer');
        
        setInterval(() => {
            seconds++;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            timer.textContent = \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
        }, 1000);

        // File Upload
        const fileInput = document.getElementById('fileInput');
        const assetGrid = document.getElementById('assetGrid');

        fileInput.addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const card = document.createElement('div');
                    card.className = 'asset-card';
                    card.innerHTML = \`
                        <div class="asset-preview">
                            <img src="\${event.target.result}" alt="\${file.name}">
                        </div>
                        <div class="asset-info">
                            <div class="asset-name">\${file.name}</div>
                            <div class="asset-meta">
                                <span>\${file.type.split('/')[1].toUpperCase()}</span>
                                <span>\${(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                    \`;
                    assetGrid.appendChild(card);
                };
                reader.readAsDataURL(file);
            });
        });

        console.log('🎨 Meauxbility Dashboard initialized');
        console.log('📱 Mobile-first navigation active');
        console.log('🔍 Search is functional');
        console.log('🎯 48 icons ready to use');
    </script>
</body>
</html>`;
}

function getHomeHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Meauxbility Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <style>
        /* ==================== RESET & BASE ==================== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Meaux Brand Colors */
            --meaux-teal: #14b8a6;
            --meaux-teal-light: #5eead4;
            --meaux-teal-dark: #0d9488;
            --meaux-mint: #6ee7b7;
            --meaux-mint-light: #a7f3d0;
            --meaux-mint-dark: #34d399;
            
            /* Dark Theme */
            --bg-primary: #0a0e1a;
            --bg-secondary: #0f1420;
            --bg-tertiary: #151b2b;
            --bg-elevated: #1a2235;
            
            /* Text Colors */
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            
            /* Borders */
            --border-color: rgba(148, 163, 184, 0.12);
            --border-color-light: rgba(148, 163, 184, 0.08);
            
            /* Status Colors */
            --status-active: #10b981;
            --status-warning: #f59e0b;
            --status-error: #ef4444;
            --status-info: #3b82f6;
            
            /* Spacing */
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            --spacing-2xl: 48px;
            
            /* Sidebar */
            --sidebar-width: 280px;
            --sidebar-collapsed: 72px;
            --topbar-height: 60px;
            --mobile-bottom-nav: 68px;
            
            /* Transitions */
            --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
            --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
            --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
            
            /* Shadows */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            --shadow-glow: 0 0 20px rgba(20, 184, 166, 0.3);
        }

        body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* ==================== UTILITY CLASSES ==================== */
        .hidden { display: none !important; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: var(--spacing-sm); }
        .gap-3 { gap: 12px; }
        .gap-4 { gap: var(--spacing-md); }

        /* ==================== TOP TOOLBAR ==================== */
        .top-toolbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--topbar-height);
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 var(--spacing-md);
            z-index: 1000;
            backdrop-filter: blur(12px);
        }

        .toolbar-left {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .menu-toggle {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
        }

        .menu-toggle:hover {
            background: var(--bg-elevated);
        }

        .menu-toggle svg {
            width: 24px;
            height: 24px;
            stroke: var(--text-primary);
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, var(--meaux-teal) 0%, var(--meaux-mint) 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 18px;
            color: white;
            letter-spacing: -0.5px;
        }

        .logo-text {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.5px;
            display: none;
        }

        .toolbar-right {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .toolbar-icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
            position: relative;
        }

        .toolbar-icon-btn:hover {
            background: var(--bg-elevated);
        }

        .toolbar-icon-btn svg {
            width: 20px;
            height: 20px;
            stroke: var(--text-secondary);
        }

        .toolbar-icon-btn:hover svg {
            stroke: var(--meaux-teal-light);
        }

        .notification-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background: var(--status-error);
            border-radius: 50%;
            border: 2px solid var(--bg-secondary);
        }

        .time-tracker-widget {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: 8px 16px;
            background: var(--bg-elevated);
            border-radius: 10px;
            border: 1px solid var(--border-color);
        }

        .timer-display {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            color: var(--meaux-teal-light);
            min-width: 80px;
        }

        .timer-status {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--status-active);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }

        /* ==================== SIDEBAR NAVIGATION ==================== */
        .sidebar {
            position: fixed;
            left: 0;
            top: var(--topbar-height);
            bottom: 0;
            width: var(--sidebar-width);
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            padding: var(--spacing-lg) 0;
            overflow-y: auto;
            overflow-x: hidden;
            transition: transform var(--transition-normal);
            z-index: 900;
        }

        .sidebar::-webkit-scrollbar {
            width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        .nav-section {
            margin-bottom: var(--spacing-xl);
            padding: 0 var(--spacing-md);
        }

        .nav-section-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--text-muted);
            padding: 0 var(--spacing-md);
            margin-bottom: var(--spacing-md);
        }

        .nav-items {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px var(--spacing-md);
            border-radius: 10px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all var(--transition-fast);
            cursor: pointer;
            position: relative;
        }

        .nav-item:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
            transform: translateX(4px);
        }

        .nav-item.active {
            background: linear-gradient(90deg, rgba(20, 184, 166, 0.15) 0%, transparent 100%);
            color: var(--meaux-teal-light);
            border-left: 3px solid var(--meaux-teal);
        }

        .nav-item svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            flex-shrink: 0;
        }

        .nav-item-text {
            flex: 1;
        }

        .nav-item-badge {
            padding: 2px 8px;
            background: var(--meaux-teal);
            color: white;
            font-size: 11px;
            font-weight: 700;
            border-radius: 6px;
        }

        .nav-expand-icon {
            width: 16px;
            height: 16px;
            stroke: var(--text-muted);
            transition: transform var(--transition-fast);
        }

        .nav-subitems {
            max-height: 0;
            overflow: hidden;
            transition: max-height var(--transition-normal);
            margin-left: 32px;
            margin-top: 4px;
        }

        .nav-subitems.open {
            max-height: 500px;
        }

        .nav-subitem {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px var(--spacing-md);
            border-radius: 8px;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: all var(--transition-fast);
        }

        .nav-subitem:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
        }

        .nav-subitem.active {
            background: rgba(20, 184, 166, 0.1);
            color: var(--meaux-teal-light);
        }

        /* ==================== MOBILE BOTTOM NAVIGATION ==================== */
        .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: var(--mobile-bottom-nav);
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: var(--spacing-sm) var(--spacing-md);
            z-index: 1000;
            backdrop-filter: blur(12px);
        }

        .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 11px;
            font-weight: 600;
            transition: all var(--transition-fast);
            flex: 1;
            padding: var(--spacing-sm);
            border-radius: 12px;
            position: relative;
        }

        .bottom-nav-item svg {
            width: 24px;
            height: 24px;
            stroke: currentColor;
        }

        .bottom-nav-item.active {
            color: var(--meaux-teal-light);
            background: rgba(20, 184, 166, 0.1);
        }

        .bottom-nav-item.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 3px;
            background: var(--meaux-teal);
            border-radius: 0 0 3px 3px;
        }

        /* ==================== MAIN CONTENT AREA ==================== */
        .main-wrapper {
            margin-top: var(--topbar-height);
            margin-left: 0;
            min-height: calc(100vh - var(--topbar-height));
            transition: margin-left var(--transition-normal);
        }

        .content-container {
            padding: var(--spacing-lg) var(--spacing-md);
            padding-bottom: calc(var(--mobile-bottom-nav) + var(--spacing-lg));
            max-width: 1600px;
            margin: 0 auto;
        }

        /* ==================== API STATUS BAR ==================== */
        .api-status-bar {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .api-status-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .api-status-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
        }

        .api-status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: var(--spacing-sm);
        }

        .api-status-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) 12px;
            background: var(--bg-elevated);
            border: 1px solid var(--border-color-light);
            border-radius: 8px;
            transition: all var(--transition-fast);
        }

        .api-status-item:hover {
            border-color: var(--meaux-teal);
            transform: translateY(-2px);
        }

        .api-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .api-status-dot.active { background: var(--status-active); }
        .api-status-dot.warning { background: var(--status-warning); }
        .api-status-dot.error { background: var(--status-error); }
        .api-status-dot.inactive { background: var(--text-muted); }

        .api-status-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
        }

        /* ==================== TIME TRACKING CARD ==================== */
        .time-tracking-card {
            background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-elevated) 100%);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
        }

        .time-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-lg);
        }

        .time-card-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .time-display-large {
            font-family: 'JetBrains Mono', monospace;
            font-size: 48px;
            font-weight: 700;
            color: var(--meaux-teal-light);
            text-align: center;
            margin: var(--spacing-xl) 0;
            letter-spacing: 2px;
        }

        .time-controls {
            display: flex;
            gap: var(--spacing-md);
            margin-top: var(--spacing-lg);
        }

        .btn-primary, .btn-secondary {
            flex: 1;
            padding: 14px var(--spacing-lg);
            border-radius: 12px;
            border: none;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--meaux-teal) 0%, var(--meaux-mint) 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-glow);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .btn-secondary {
            background: var(--bg-elevated);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background: var(--bg-tertiary);
            border-color: var(--meaux-teal);
        }

        .time-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--spacing-md);
            margin-top: var(--spacing-lg);
        }

        .time-stat {
            background: var(--bg-elevated);
            padding: var(--spacing-md);
            border-radius: 10px;
            border: 1px solid var(--border-color-light);
        }

        .time-stat-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            margin-bottom: 4px;
        }

        .time-stat-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 20px;
            font-weight: 700;
            color: var(--meaux-teal-light);
        }

        /* ==================== DASHBOARD CARDS ==================== */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
        }

        .dashboard-card {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: var(--spacing-lg);
            transition: all var(--transition-fast);
        }

        .dashboard-card:hover {
            border-color: var(--meaux-teal);
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-md);
        }

        .card-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .card-value {
            font-size: 36px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: var(--spacing-sm);
        }

        .card-subtitle {
            font-size: 13px;
            color: var(--text-muted);
        }

        .card-progress {
            margin-top: var(--spacing-md);
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: var(--bg-elevated);
            border-radius: 3px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--meaux-teal) 0%, var(--meaux-mint) 100%);
            border-radius: 3px;
            transition: width var(--transition-slow);
        }

        /* ==================== QUICK ACTIONS ==================== */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
        }

        .quick-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-lg);
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            cursor: pointer;
            transition: all var(--transition-fast);
            text-decoration: none;
            color: var(--text-primary);
        }

        .quick-action-btn:hover {
            background: var(--bg-elevated);
            border-color: var(--meaux-teal);
            transform: translateY(-4px);
        }

        .quick-action-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--meaux-teal) 0%, var(--meaux-mint) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .quick-action-icon svg {
            width: 24px;
            height: 24px;
            stroke: white;
        }

        .quick-action-label {
            font-size: 13px;
            font-weight: 600;
            text-align: center;
        }

        /* ==================== RESPONSIVE ==================== */
        @media (min-width: 768px) {
            .logo-text {
                display: block;
            }

            .mobile-bottom-nav {
                display: none;
            }

            .sidebar {
                transform: translateX(0);
            }

            .main-wrapper {
                margin-left: var(--sidebar-width);
            }

            .content-container {
                padding: var(--spacing-xl);
                padding-bottom: var(--spacing-xl);
            }

            .api-status-bar {
                flex-direction: row;
                align-items: center;
            }

            .api-status-grid {
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            }
        }

        @media (max-width: 767px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.open {
                transform: translateX(0);
                box-shadow: var(--shadow-lg);
            }

            .time-display-large {
                font-size: 36px;
            }

            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }

        /* ==================== MOBILE OVERLAY ==================== */
        .mobile-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 850;
            opacity: 0;
            transition: opacity var(--transition-normal);
        }

        .mobile-overlay.active {
            display: block;
            opacity: 1;
        }

        /* ==================== CUSTOM SCROLLBAR ==================== */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--meaux-teal);
        }
    </style>
</head>
<body>
    <!-- Top Toolbar -->
    <div class="top-toolbar">
        <div class="toolbar-left">
            <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            
            <div class="logo-container">
                <div class="logo-icon">M</div>
                <span class="logo-text">MEAUXBILITY</span>
            </div>
        </div>

        <div class="toolbar-right">
            <!-- Time Tracker Widget (Desktop) -->
            <div class="time-tracker-widget">
                <div class="timer-status" id="timerStatus"></div>
                <div class="timer-display" id="toolbarTimer">00:00:00</div>
                <div style="font-size:12px;color:var(--text-secondary);" id="currentTime">--:--:--</div>
            </div>

            <!-- Search -->
            <button class="toolbar-icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>

            <!-- Notifications -->
            <button class="toolbar-icon-btn" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="notification-badge"></span>
            </button>

            <!-- Settings -->
            <button class="toolbar-icon-btn" aria-label="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m5.2-13.8l-4.2 4.2m0 0l-4.2 4.2m10.2-2.4h-6m-6 0H1m5.8 5.2l4.2-4.2m0 0l4.2-4.2"></path>
                </svg>
            </button>

            <!-- User Avatar -->
            <button class="toolbar-icon-btn" aria-label="User menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" id="mobileOverlay"></div>

    <!-- Sidebar Navigation -->
    <nav class="sidebar" id="sidebar">
        <!-- MAIN Section -->
        <div class="nav-section">
            <div class="nav-section-label">Main</div>
            <div class="nav-items">
                <a href="/home" class="nav-item active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span class="nav-item-text">Home</span>
                </a>

                <a href="/" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span class="nav-item-text">Dashboard</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    <div class="mobile-bottom-nav">
        <a href="/home" class="bottom-nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Home</span>
        </a>

        <a href="/" class="bottom-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span>Work</span>
        </a>
    </div>

    <!-- Main Content -->
    <main class="main-wrapper">
        <div class="content-container">
            <!-- HOME SECTION -->
            <section id="section-home" class="section active">
            <!-- API Status Bar -->
            <div class="api-status-bar">
                <div class="api-status-header">
                    <div class="api-status-title">API Status</div>
                    <a href="/dashboard/dev/keys" style="color: var(--meaux-teal); text-decoration: none; font-size: 13px; font-weight: 600;">Manage</a>
                </div>
                <div class="api-status-grid" id="apiStatusGrid">
                    <div class="api-status-item">
                        <div class="api-status-dot active" id="status-openai"></div>
                        <div class="api-status-name">OpenAI</div>
                    </div>
                    <div class="api-status-item">
                        <div class="api-status-dot active" id="status-claude"></div>
                        <div class="api-status-name">Claude</div>
                    </div>
                    <div class="api-status-item">
                        <div class="api-status-dot active" id="status-cursor"></div>
                        <div class="api-status-name">Cursor</div>
                    </div>
                    <div class="api-status-item">
                        <div class="api-status-dot active" id="status-cloudconvert"></div>
                        <div class="api-status-name">CloudConvert</div>
                    </div>
                    <div class="api-status-item">
                        <div class="api-status-dot active" id="status-stripe"></div>
                        <div class="api-status-name">Stripe</div>
                    </div>
                    <div class="api-status-item">
                        <div class="api-status-dot warning" id="status-resend"></div>
                        <div class="api-status-name">Resend</div>
                    </div>
                </div>
            </div>

            <!-- Time Tracking Card -->
            <div class="time-tracking-card">
                <div class="time-card-header">
                    <div class="time-card-title">Active Time Tracking</div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--meaux-teal-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>

                <div class="time-display-large" id="mainTimer">00:00:00</div>

                <div class="time-controls">
                    <button class="btn-primary" id="startStopBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Start Timer
                    </button>
                    <button class="btn-secondary" id="resetBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Reset
                    </button>
                </div>

                <div class="time-stats-grid">
                    <div class="time-stat">
                        <div class="time-stat-label">Today</div>
                        <div class="time-stat-value" id="todayStat">00:00:00</div>
                    </div>
                    <div class="time-stat">
                        <div class="time-stat-label">This Week</div>
                        <div class="time-stat-value" id="weekStat">00:00:00</div>
                    </div>
                    <div class="time-stat">
                        <div class="time-stat-label">This Month</div>
                        <div class="time-stat-value" id="monthStat">00:00:00</div>
                    </div>
                    <div class="time-stat">
                        <div class="time-stat-label">Cost (USD)</div>
                        <div class="time-stat-value" id="costStat">$0.00</div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="/dashboard/work/projects" class="quick-action-btn">
                    <div class="quick-action-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <div class="quick-action-label">New Project</div>
                </a>

                <a href="/dashboard/apps/photo" class="quick-action-btn">
                    <div class="quick-action-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </div>
                    <div class="quick-action-label">Upload Files</div>
                </a>

                <a href="/dashboard/chat/mail" class="quick-action-btn">
                    <div class="quick-action-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </div>
                    <div class="quick-action-label">Send Email</div>
                </a>

                <a href="/dashboard/dev/keys" class="quick-action-btn">
                    <div class="quick-action-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                        </svg>
                    </div>
                    <div class="quick-action-label">API Keys</div>
                </a>
            </div>

            <!-- Dashboard Cards Grid -->
            <div class="dashboard-grid" id="dashboardGrid">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Active Projects</div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--meaux-teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <div class="card-value" id="activeProjects">12</div>
                    <div class="card-subtitle">3 completed this week</div>
                    <div class="card-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 75%;"></div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">API Requests</div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--meaux-mint)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                    </div>
                    <div class="card-value" id="apiRequests">847K</div>
                    <div class="card-subtitle" id="apiRequestsDelta">+12% from last month</div>
                    <div class="card-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 60%;"></div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Storage Used</div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--status-warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                    </div>
                    <div class="card-value" id="storageUsed">48GB</div>
                    <div class="card-subtitle" id="storageSubtitle">of 100GB available</div>
                    <div class="card-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="storageProgress" style="width: 48%;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Assets -->
            <div class="upload-zone" id="uploadZone">
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <div class="upload-text">Cloudflare R2: drop files or click to upload (coming soon)</div>
                <div class="upload-subtext">Current files listed below</div>
            </div>
            <input type="file" id="fileInput" style="display: none;" multiple accept="image/*">

            <div class="asset-grid" id="assetGrid">
                <!-- Populated dynamically -->
            </div>
            </section>

            <!-- BUILDER SECTION -->
            <section id="section-builder" class="section">
                <div class="page-header">
                    <h1 class="page-title">Autonomous Builder</h1>
                    <p class="page-subtitle">Create and run coding sessions with the autonomous agent.</p>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Start a new project</div>
                    </div>
                    <p class="card-subtitle" style="margin-bottom:16px;">Use the chat on the Dashboard to guide the agent, or create sessions via API.</p>
                    <a href="/" class="btn-primary" style="display:inline-flex;gap:8px;align-items:center;text-decoration:none;padding:12px 16px;border-radius:10px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Go to Dashboard Chat
                    </a>
                </div>
            </section>

            <!-- DESIGNS SECTION -->
            <section id="section-designs" class="section">
                <div class="page-header">
                    <h1 class="page-title">Designs</h1>
                    <p class="page-subtitle">Creative projects and design assets.</p>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Design Library</div>
                    </div>
                    <p class="card-subtitle">Organize and preview design assets. (Coming soon)</p>
                </div>
            </section>

            <!-- ASSETS SECTION -->
            <section id="section-assets" class="section">
                <div class="page-header">
                    <h1 class="page-title">Assets</h1>
                    <p class="page-subtitle">Browse and edit Cloudflare R2 media metadata.</p>
                </div>
                <div class="upload-zone" id="uploadZone2">
                    <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <div class="upload-text">Cloudflare R2: files</div>
                    <div class="upload-subtext">Listed below; upload coming soon</div>
                </div>
                <div class="asset-grid" id="assetGrid2"></div>
            </section>

            <!-- API SECTION -->
            <section id="section-api" class="section">
                <div class="page-header">
                    <h1 class="page-title">API Keys</h1>
                    <p class="page-subtitle">Status and management.</p>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Status</div>
                    </div>
                    <div id="apiStatusList" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;"></div>
                </div>
            </section>

            <!-- DEV SECTION -->
            <section id="section-dev" class="section">
                <div class="page-header">
                    <h1 class="page-title">Developer Tools</h1>
                    <p class="page-subtitle">Utilities and integrations.</p>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><div class="card-title">Tools</div></div>
                    <ul style="color:var(--text-secondary);line-height:1.8;">
                        <li>Time tracking API: /api/time/start, /stop, /status</li>
                        <li>Images API: /api/images (GET), /api/images/:key/metadata (PUT)</li>
                        <li>Sessions API: /api/sessions, /api/sessions/:id/run, /chat, /messages</li>
                        <li>DB init: /api/init</li>
                    </ul>
                </div>
            </section>
        </div>
    </main>

    <script>
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const toolbarTimer = document.getElementById('toolbarTimer');
        const mainTimer = document.getElementById('mainTimer');
        const startStopBtn = document.getElementById('startStopBtn');
        const resetBtn = document.getElementById('resetBtn');
        const todayStat = document.getElementById('todayStat');
        const weekStat = document.getElementById('weekStat');
        const monthStat = document.getElementById('monthStat');
        const costStat = document.getElementById('costStat');
        const timerStatus = document.getElementById('timerStatus');
        const currentTimeEl = document.getElementById('currentTime');
        const assetGrid = document.getElementById('assetGrid');
        let timerInterval = null;
        let timerRunning = false;
        let timerStart = null;
        let timerSeconds = 0;

        // Sidebar toggle
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        });
        mobileOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Time helpers
        function formatTime(seconds) {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return \`\${String(hrs).padStart(2, '0')}:\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
        }
        function formatCurrency(n) {
            return '$' + n.toFixed(2);
        }
        function updateTimerDisplay(sec) {
            mainTimer.textContent = formatTime(sec);
            toolbarTimer.textContent = formatTime(sec);
        }
        function setRunning(running) {
            timerRunning = running;
            timerStatus.style.background = running ? 'var(--status-active)' : 'var(--text-muted)';
            startStopBtn.innerHTML = running ? \`
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Stop Timer
            \` : \`
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Start Timer
            \`;
        }
        function startLocalTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                if (timerRunning && timerStart !== null) {
                    const nowSec = Math.floor(Date.now() / 1000);
                    timerSeconds = nowSec - timerStart;
                    updateTimerDisplay(timerSeconds);
                }
            }, 1000);
        }

        async function refreshTimeStatus() {
            try {
                const res = await fetch('/api/time/status');
                if (!res.ok) throw new Error('Failed to load time status');
                const data = await res.json();
                const running = data.running;
                timerStart = running ? data.started_at : null;
                timerSeconds = data.seconds || 0;
                setRunning(running);
                updateTimerDisplay(timerSeconds);
                todayStat.textContent = formatTime(data.aggregates.today_seconds || 0);
                weekStat.textContent = formatTime(data.aggregates.week_seconds || 0);
                monthStat.textContent = formatTime(data.aggregates.month_seconds || 0);
                costStat.textContent = formatCurrency(data.aggregates.month_cost || 0);
                startLocalTimer();
            } catch (err) {
                console.error(err);
            }
        }

        async function startTimer() {
            try {
                const res = await fetch('/api/time/start', { method: 'POST' });
                if (!res.ok) throw new Error('Start failed');
                const data = await res.json();
                timerStart = data.started_at;
                timerSeconds = 0;
                setRunning(true);
                startLocalTimer();
            } catch (err) {
                console.error(err);
            }
        }

        async function stopTimer() {
            try {
                const res = await fetch('/api/time/stop', { method: 'POST' });
                if (!res.ok) throw new Error('Stop failed');
                const data = await res.json();
                timerSeconds = data.seconds || timerSeconds;
                setRunning(false);
                updateTimerDisplay(timerSeconds);
            } catch (err) {
                console.error(err);
            }
        }

        function resetTimer() {
            timerSeconds = 0;
            timerStart = null;
            setRunning(false);
            updateTimerDisplay(timerSeconds);
        }

        startStopBtn.addEventListener('click', () => {
            if (timerRunning) stopTimer(); else startTimer();
        });
        resetBtn.addEventListener('click', resetTimer);

        // Clock
        function updateClock() {
            const now = new Date();
            currentTimeEl.textContent = now.toLocaleTimeString();
        }
        setInterval(updateClock, 1000);
        updateClock();

        // Images
        async function loadImages() {
            if (!assetGrid) return;
            try {
                const res = await fetch('/api/images');
                if (!res.ok) throw new Error('Failed to load images');
                const data = await res.json();
                assetGrid.innerHTML = '';
                data.images.forEach((img) => {
                    const card = document.createElement('div');
                    card.className = 'asset-card';
                    const title = img.metadata?.title || img.key;
                    const alt = img.metadata?.alt || '';
                    const tags = img.metadata?.tags ? img.metadata.tags.join(', ') : '';
                    card.innerHTML = \`
                        <div class="asset-preview">
                            <div style="color:var(--text-tertiary);font-size:12px;">\${img.key}</div>
                        </div>
                        <div class="asset-info">
                            <div class="asset-name">\${title}</div>
                            <div class="asset-meta">
                                <span>\${(img.size/1024).toFixed(1)} KB</span>
                                <span>\${tags || 'no tags'}</span>
                            </div>
                            <button style="margin-top:8px;padding:8px 10px;border:1px solid var(--border-color);background:var(--bg-elevated);color:var(--text-primary);border-radius:8px;cursor:pointer;" data-key="\${img.key}">Edit Meta</button>
                        </div>
                    \`;
                    card.querySelector('button')?.addEventListener('click', () => editMeta(img.key, title, alt, tags));
                    assetGrid.appendChild(card);
                });
            } catch (err) {
                console.error(err);
            }
        }

        async function editMeta(key, title, alt, tags) {
            const newTitle = prompt('Title', title) ?? title;
            const newAlt = prompt('Alt text', alt) ?? alt;
            const newTags = prompt('Tags (comma separated)', tags) ?? tags;
            try {
                const res = await fetch('/api/images/' + encodeURIComponent(key) + '/metadata', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newTitle || undefined,
                        alt: newAlt || undefined,
                        tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : []
                    })
                });
                if (!res.ok) throw new Error('Failed to update metadata');
                await loadImages();
            } catch (err) {
                console.error(err);
                alert('Meta update failed: ' + err.message);
            }
        }

        // Init
        function setActiveSection(path) {
            const map = {
                '/home': 'section-home',
                '/': 'section-home',
                '/dashboard': 'section-home',
                '/builder': 'section-builder',
                '/designs': 'section-designs',
                '/assets': 'section-assets',
                '/api': 'section-api',
                '/dev': 'section-dev',
            };
            const sectionId = map[path] || 'section-home';
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const el = document.getElementById(sectionId);
            if (el) el.classList.add('active');

            // Sync asset grids
            if (sectionId === 'section-assets') {
                loadImages(true);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            refreshTimeStatus();
            loadImages();
            setActiveSection(window.location.pathname);
        });
    </script>
</body>
</html>`;
}

