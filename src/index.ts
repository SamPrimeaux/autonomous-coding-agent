export interface Env {
    DB: D1Database;
    STORAGE: R2Bucket;
    AI: Ai;
    ANTHROPIC_API_KEY?: string;
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
                CREATE INDEX IF NOT EXISTS idx_status ON agent_sessions(status);
                CREATE INDEX IF NOT EXISTS idx_project_name ON agent_sessions(project_name);
            `);
            return jsonResponse({ success: true, message: 'Database initialized' }, corsHeaders);
        }

        // Create new agent session
        if (pathname === '/api/sessions' && method === 'POST') {
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
        }

        // Get all sessions
        if (pathname === '/api/sessions' && method === 'GET') {
            const result = await env.DB.prepare('SELECT * FROM agent_sessions ORDER BY created_at DESC')
                .all<AgentSession>();
            return jsonResponse({ sessions: result.results || [] }, corsHeaders);
        }

        // Get single session
        if (pathname.startsWith('/api/sessions/') && method === 'GET') {
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
        }

        // Start/continue agent session
        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/run') && method === 'POST') {
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

            // Simulate agent work (in production, this would call Claude API)
            const response = {
                success: true,
                message: 'Agent session started',
                session_id: id,
                status: 'coding',
                note: 'Agent is working on the project. Check status endpoint for updates.',
            };

            return jsonResponse(response, corsHeaders);
        }

        // Serve HTML dashboard
        if (pathname === '/' || pathname === '/index.html') {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autonomous Coding Agent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0e1a 0%, #060911 100%);
            color: #e8eef7;
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 {
            background: linear-gradient(135deg, #3dd9d0 0%, #7de3cb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        .subtitle { color: #a0aec0; margin-bottom: 2rem; }
        .actions {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            background: linear-gradient(135deg, #3dd9d0 0%, #7de3cb 100%);
            color: #0a0e1a;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(61, 217, 208, 0.4); }
        .btn-secondary {
            background: rgba(20, 28, 46, 0.95);
            color: #e8eef7;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sessions-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        .session-card {
            background: rgba(20, 28, 46, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.2s;
        }
        .session-card:hover {
            border-color: rgba(61, 217, 208, 0.3);
            transform: translateY(-2px);
        }
        .session-name {
            font-weight: 600;
            color: #3dd9d0;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
        }
        .status-initializing { background: rgba(96, 165, 250, 0.2); color: #60a5fa; }
        .status-coding { background: rgba(52, 211, 153, 0.2); color: #34d399; }
        .status-completed { background: rgba(52, 211, 153, 0.2); color: #34d399; }
        .status-error { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin: 0.75rem 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3dd9d0 0%, #7de3cb 100%);
            transition: width 0.3s ease;
        }
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        .modal.active { display: flex; }
        .modal-content {
            background: rgba(20, 28, 46, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #a0aec0;
            font-weight: 500;
        }
        .form-input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(10, 14, 26, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #e8eef7;
            font-family: inherit;
        }
        .form-textarea {
            min-height: 200px;
            resize: vertical;
        }
        .loading { opacity: 0.6; pointer-events: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Autonomous Coding Agent</h1>
        <p class="subtitle">AI-powered autonomous application builder using Claude API</p>
        
        <div class="actions">
            <button class="btn" onclick="loadSessions()">🔄 Refresh</button>
            <button class="btn" onclick="openModal()">➕ New Project</button>
            <button class="btn btn-secondary" onclick="initDB()">🔧 Initialize DB</button>
        </div>

        <div id="sessionsGrid" class="sessions-grid"></div>
    </div>

    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 style="margin-bottom: 1.5rem;">Create New Coding Project</h2>
            <div class="form-group">
                <label class="form-label">Project Name</label>
                <input type="text" id="projectName" class="form-input" placeholder="my-awesome-app">
            </div>
            <div class="form-group">
                <label class="form-label">Application Specification</label>
                <textarea id="appSpec" class="form-input form-textarea" placeholder="Describe the application you want to build...&#10;&#10;Example:&#10;Build a todo app with:&#10;- Add/remove tasks&#10;- Mark tasks as complete&#10;- Filter by status&#10;- Local storage persistence"></textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn" onclick="createSession()">Create & Start</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    </div>

    <script>
        async function initDB() {
            try {
                const res = await fetch('/api/init');
                const data = await res.json();
                alert('Database initialized!');
                loadSessions();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        async function loadSessions() {
            const grid = document.getElementById('sessionsGrid');
            grid.classList.add('loading');
            try {
                const res = await fetch('/api/sessions');
                const data = await res.json();
                grid.innerHTML = '';
                if (data.sessions && data.sessions.length > 0) {
                    data.sessions.forEach(session => {
                        const card = document.createElement('div');
                        card.className = 'session-card';
                        const progress = session.features_total > 0 
                            ? Math.round((session.features_completed / session.features_total) * 100)
                            : 0;
                        const statusClass = 'status-' + session.status;
                        card.innerHTML = \`
                            <div class="session-name">\${session.project_name}</div>
                            <div class="status-badge \${statusClass}">\${session.status}</div>
                            \${session.features_total > 0 ? \`
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: \${progress}%"></div>
                                </div>
                                <div style="color: #a0aec0; font-size: 0.875rem;">
                                    \${session.features_completed} / \${session.features_total} features completed
                                </div>
                            \` : ''}
                            \${session.current_feature ? \`
                                <div style="color: #6b7280; font-size: 0.813rem; margin-top: 0.5rem;">
                                    Current: \${session.current_feature}
                                </div>
                            \` : ''}
                            <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%;" onclick="runSession('\${session.id}')">Run Agent</button>
                        \`;
                        grid.appendChild(card);
                    });
                } else {
                    grid.innerHTML = '<p style="color: #6b7280;">No sessions found. Create a new project to get started!</p>';
                }
            } catch (error) {
                grid.innerHTML = '<p style="color: #ef4444;">Error loading sessions: ' + error.message + '</p>';
            } finally {
                grid.classList.remove('loading');
            }
        }

        function openModal() {
            document.getElementById('modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
        }

        async function createSession() {
            const projectName = document.getElementById('projectName').value;
            const appSpec = document.getElementById('appSpec').value;

            if (!projectName) {
                alert('Please enter a project name');
                return;
            }

            try {
                const res = await fetch('/api/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_name: projectName,
                        app_spec: appSpec || undefined
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    closeModal();
                    document.getElementById('projectName').value = '';
                    document.getElementById('appSpec').value = '';
                    loadSessions();
                    if (data.session_id) {
                        setTimeout(() => runSession(data.session_id), 500);
                    }
                } else {
                    alert('Error: ' + (data.error || 'Failed to create session'));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        async function runSession(id) {
            try {
                const res = await fetch('/api/sessions/' + id + '/run', {
                    method: 'POST'
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Agent started! ' + (data.note || ''));
                    loadSessions();
                } else {
                    alert('Error: ' + (data.error || 'Failed to start agent'));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        // Load on page load
        loadSessions();
    </script>
</body>
</html>`;
}

