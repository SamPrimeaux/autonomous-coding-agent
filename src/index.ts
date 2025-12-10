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

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
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

        // Get chat messages for session
        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/messages') && method === 'GET') {
            const id = pathname.split('/api/sessions/')[1].replace('/messages', '');
            const messages = await env.DB.prepare(`
                SELECT * FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC
            `).bind(id).all<ChatMessage>();
            return jsonResponse({ messages: messages.results || [] }, corsHeaders);
        }

        // Send chat message
        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/chat') && method === 'POST') {
            const id = pathname.split('/api/sessions/')[1].replace('/chat', '');
            const body = await request.json() as { message: string };
            
            const messageId = crypto.randomUUID();
            const now = Math.floor(Date.now() / 1000);

            // Save user message
            await env.DB.prepare(`
                INSERT INTO chat_messages (id, session_id, role, content, timestamp)
                VALUES (?, ?, ?, ?, ?)
            `).bind(messageId, id, 'user', body.message, now).run();

            // TODO: Process with Claude API and save assistant response
            // For now, return a placeholder response
            const assistantId = crypto.randomUUID();
            await env.DB.prepare(`
                INSERT INTO chat_messages (id, session_id, role, content, timestamp)
                VALUES (?, ?, ?, ?, ?)
            `).bind(assistantId, id, 'assistant', 'I received your message. Claude API integration coming soon!', now + 1).run();

            return jsonResponse({ success: true, message_id: assistantId }, corsHeaders);
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
        
        :root {
            --bg-primary: #0a0e1a;
            --bg-secondary: #141c2e;
            --bg-tertiary: #1a2332;
            --text-primary: #e8eef7;
            --text-secondary: #a0aec0;
            --accent-primary: #3dd9d0;
            --accent-secondary: #7de3cb;
            --border-color: rgba(255, 255, 255, 0.1);
            --spacing-xs: 0.5rem;
            --spacing-sm: 0.75rem;
            --spacing-md: 1rem;
            --spacing-lg: 1.5rem;
            --spacing-xl: 2rem;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            height: 100vh;
            overflow: hidden;
            display: flex;
        }
        
        /* Sidebar Navigation */
        .sidebar {
            width: 280px;
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
            z-index: 100;
        }
        
        .sidebar-header {
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--border-color);
        }
        
        .sidebar-logo {
            font-size: 1.25rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: var(--spacing-xs);
        }
        
        .sidebar-subtitle {
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .sidebar-nav {
            flex: 1;
            padding: var(--spacing-md);
            overflow-y: auto;
        }
        
        .nav-section {
            margin-bottom: var(--spacing-lg);
        }
        
        .nav-section-title {
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: var(--spacing-sm);
            padding: 0 var(--spacing-sm);
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xs);
        }
        
        .nav-item:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, rgba(61, 217, 208, 0.2) 0%, rgba(125, 227, 203, 0.2) 100%);
            color: var(--accent-primary);
            border-left: 3px solid var(--accent-primary);
        }
        
        .nav-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Main Container */
        .main-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        /* Top Header */
        .header {
            height: 64px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            padding: 0 var(--spacing-lg);
            gap: var(--spacing-lg);
        }
        
        .menu-toggle {
            display: none;
            width: 40px;
            height: 40px;
            border: none;
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            border-radius: 8px;
            align-items: center;
            justify-content: center;
        }
        
        .menu-toggle:hover {
            background: var(--bg-tertiary);
        }
        
        .header-title {
            flex: 1;
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .header-actions {
            display: flex;
            gap: var(--spacing-md);
            align-items: center;
        }
        
        .btn {
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-size: 0.875rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            color: var(--bg-primary);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(61, 217, 208, 0.4);
        }
        
        .btn-secondary {
            background: var(--bg-tertiary);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }
        
        .btn-secondary:hover {
            background: var(--bg-secondary);
        }
        
        /* Content Area - Flex Container */
        .content-area {
            flex: 1;
            display: flex;
            overflow: hidden;
        }
        
        /* Chat Panel */
        .chat-panel {
            width: 400px;
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
        }
        
        .chat-header {
            padding: var(--spacing-md) var(--spacing-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .chat-title {
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-lg);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }
        
        .message {
            display: flex;
            gap: var(--spacing-sm);
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-weight: 600;
            font-size: 0.75rem;
        }
        
        .message.user .message-avatar {
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            color: var(--bg-primary);
        }
        
        .message.assistant .message-avatar {
            background: var(--bg-tertiary);
            color: var(--accent-primary);
        }
        
        .message-content {
            flex: 1;
            background: var(--bg-tertiary);
            padding: var(--spacing-md);
            border-radius: 12px;
            line-height: 1.6;
            font-size: 0.875rem;
        }
        
        .message.user .message-content {
            background: linear-gradient(135deg, rgba(61, 217, 208, 0.15) 0%, rgba(125, 227, 203, 0.15) 100%);
            border: 1px solid rgba(61, 217, 208, 0.3);
        }
        
        .chat-input-container {
            padding: var(--spacing-lg);
            border-top: 1px solid var(--border-color);
        }
        
        .chat-input-wrapper {
            display: flex;
            gap: var(--spacing-sm);
            align-items: flex-end;
        }
        
        .chat-input {
            flex: 1;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: var(--spacing-md);
            color: var(--text-primary);
            font-family: inherit;
            font-size: 0.875rem;
            resize: none;
            min-height: 44px;
            max-height: 120px;
        }
        
        .chat-input:focus {
            outline: none;
            border-color: var(--accent-primary);
        }
        
        .chat-send {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            border: none;
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            color: var(--bg-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s;
        }
        
        .chat-send:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(61, 217, 208, 0.4);
        }
        
        /* Preview Panel */
        .preview-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--bg-primary);
            overflow: hidden;
        }
        
        .preview-header {
            padding: var(--spacing-md) var(--spacing-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .preview-title {
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .preview-content {
            flex: 1;
            overflow: auto;
            padding: var(--spacing-lg);
        }
        
        .preview-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-secondary);
            text-align: center;
        }
        
        .preview-placeholder-icon {
            width: 64px;
            height: 64px;
            margin-bottom: var(--spacing-lg);
            opacity: 0.5;
        }
        
        /* Sessions List */
        .sessions-list {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }
        
        .session-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: var(--spacing-lg);
            transition: all 0.2s;
            cursor: pointer;
        }
        
        .session-card:hover {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
        }
        
        .session-name {
            font-weight: 600;
            color: var(--accent-primary);
            margin-bottom: var(--spacing-sm);
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
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
            margin: var(--spacing-sm) 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            transition: width 0.3s ease;
        }
        
        /* Modal */
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
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: var(--spacing-xl);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .form-group {
            margin-bottom: var(--spacing-lg);
        }
        
        .form-label {
            display: block;
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 0.875rem;
        }
        
        .form-input {
            width: 100%;
            padding: var(--spacing-md);
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-family: inherit;
        }
        
        .form-textarea {
            min-height: 200px;
            resize: vertical;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                height: 100vh;
                transform: translateX(-100%);
            }
            
            .sidebar.open {
                transform: translateX(0);
            }
            
            .menu-toggle {
                display: flex;
            }
            
            .chat-panel {
                width: 100%;
                position: fixed;
                right: 0;
                top: 64px;
                height: calc(100vh - 64px);
                transform: translateX(100%);
                z-index: 99;
            }
            
            .chat-panel.open {
                transform: translateX(0);
            }
            
            .preview-panel {
                width: 100%;
            }
        }
        
        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--bg-tertiary);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-primary);
        }
    </style>
</head>
<body>
    <!-- Sidebar Navigation -->
    <nav class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">🤖 Autonomous Agent</div>
            <div class="sidebar-subtitle">Coding Assistant</div>
        </div>
        <div class="sidebar-nav">
            <div class="nav-section">
                <div class="nav-section-title">Core</div>
                <div class="nav-item active" data-view="dashboard">
                    <div class="nav-icon">📊</div>
                    <span>Dashboard</span>
                </div>
                <div class="nav-item" data-view="sessions">
                    <div class="nav-icon">📁</div>
                    <span>Projects</span>
                </div>
                <div class="nav-item" data-view="analytics">
                    <div class="nav-icon">📈</div>
                    <span>Analytics</span>
                </div>
            </div>
            <div class="nav-section">
                <div class="nav-section-title">Tools</div>
                <div class="nav-item" data-view="settings">
                    <div class="nav-icon">⚙️</div>
                    <span>Settings</span>
                </div>
                <div class="nav-item" onclick="initDB()">
                    <div class="nav-icon">🔧</div>
                    <span>Initialize DB</span>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="main-container">
        <!-- Header -->
        <header class="header">
            <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
            <div class="header-title" id="headerTitle">Dashboard</div>
            <div class="header-actions">
                <button class="btn btn-secondary" onclick="toggleChat()">💬 Chat</button>
                <button class="btn btn-primary" onclick="openModal()">➕ New Project</button>
            </div>
        </header>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Chat Panel -->
            <div class="chat-panel" id="chatPanel">
                <div class="chat-header">
                    <div class="chat-title">Agent Chat</div>
                    <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="toggleChat()">✕</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message assistant">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            Hello! I'm your autonomous coding agent. I can help you build applications, manage projects, and write code. What would you like to create today?
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <textarea class="chat-input" id="chatInput" placeholder="Type your message..." rows="1"></textarea>
                        <button class="chat-send" onclick="sendMessage()">➤</button>
                    </div>
                </div>
            </div>

            <!-- Preview Panel -->
            <div class="preview-panel">
                <div class="preview-header">
                    <div class="preview-title" id="previewTitle">Project Preview</div>
                </div>
                <div class="preview-content" id="previewContent">
                    <div class="preview-placeholder">
                        <div class="preview-placeholder-icon">👁️</div>
                        <h3>Preview Area</h3>
                        <p>Select a project or start a new one to see the preview here</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- New Project Modal -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 style="margin-bottom: var(--spacing-lg);">Create New Coding Project</h2>
            <div class="form-group">
                <label class="form-label">Project Name</label>
                <input type="text" id="projectName" class="form-input" placeholder="my-awesome-app">
            </div>
            <div class="form-group">
                <label class="form-label">Application Specification</label>
                <textarea id="appSpec" class="form-input form-textarea" placeholder="Describe the application you want to build...&#10;&#10;Example:&#10;Build a todo app with:&#10;- Add/remove tasks&#10;- Mark tasks as complete&#10;- Filter by status&#10;- Local storage persistence"></textarea>
            </div>
            <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                <button class="btn btn-primary" onclick="createSession()">Create & Start</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    </div>

    <script>
        let currentSessionId = null;
        let chatOpen = false;

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadSessions();
            setupChatInput();
            setupNavigation();
        });

        // Sidebar toggle
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        // Chat toggle
        function toggleChat() {
            chatOpen = !chatOpen;
            const panel = document.getElementById('chatPanel');
            panel.classList.toggle('open');
        }

        // Navigation
        function setupNavigation() {
            document.querySelectorAll('.nav-item[data-view]').forEach(item => {
                item.addEventListener('click', () => {
                    const view = item.dataset.view;
                    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                    item.classList.add('active');
                    showView(view);
                });
            });
        }

        function showView(view) {
            const previewContent = document.getElementById('previewContent');
            const headerTitle = document.getElementById('headerTitle');
            
            switch(view) {
                case 'dashboard':
                    headerTitle.textContent = 'Dashboard';
                    previewContent.innerHTML = '<div class="preview-placeholder"><div class="preview-placeholder-icon">📊</div><h3>Dashboard View</h3><p>Overview of all your projects and agent activity</p></div>';
                    loadSessions();
                    break;
                case 'sessions':
                    headerTitle.textContent = 'Projects';
                    loadSessionsView();
                    break;
                case 'analytics':
                    headerTitle.textContent = 'Analytics';
                    previewContent.innerHTML = '<div class="preview-placeholder"><div class="preview-placeholder-icon">📈</div><h3>Analytics</h3><p>Project statistics and performance metrics</p></div>';
                    break;
                case 'settings':
                    headerTitle.textContent = 'Settings';
                    previewContent.innerHTML = '<div class="preview-placeholder"><div class="preview-placeholder-icon">⚙️</div><h3>Settings</h3><p>Configure your agent preferences</p></div>';
                    break;
            }
        }

        // Chat functionality
        function setupChatInput() {
            const input = document.getElementById('chatInput');
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            });
        }

        async function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            if (!message) return;

            // Add user message to chat
            addChatMessage('user', message);
            input.value = '';
            input.style.height = 'auto';

            // Send to API if session exists
            if (currentSessionId) {
                try {
                    const res = await fetch('/api/sessions/' + currentSessionId + '/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        // Load updated messages
                        loadChatMessages(currentSessionId);
                    }
                } catch (error) {
                    addChatMessage('assistant', 'Error sending message: ' + error.message);
                }
            } else {
                addChatMessage('assistant', 'Please select or create a project first to start chatting with the agent.');
            }
        }

        function addChatMessage(role, content) {
            const messages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + role;
            messageDiv.innerHTML = \`
                <div class="message-avatar">\${role === 'user' ? 'You' : 'AI'}</div>
                <div class="message-content">\${content}</div>
            \`;
            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
        }

        async function loadChatMessages(sessionId) {
            try {
                const res = await fetch('/api/sessions/' + sessionId + '/messages');
                const data = await res.json();
                const messages = document.getElementById('chatMessages');
                messages.innerHTML = '';
                data.messages.forEach(msg => {
                    addChatMessage(msg.role, msg.content);
                });
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        }

        // Database initialization
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

        // Session management
        async function loadSessions() {
            try {
                const res = await fetch('/api/sessions');
                const data = await res.json();
                const previewContent = document.getElementById('previewContent');
                
                if (data.sessions && data.sessions.length > 0) {
                    previewContent.innerHTML = '<div class="sessions-list"></div>';
                    const list = previewContent.querySelector('.sessions-list');
                    
                    data.sessions.forEach(session => {
                        const card = document.createElement('div');
                        card.className = 'session-card';
                        card.onclick = () => selectSession(session.id);
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
                                <div style="color: var(--text-secondary); font-size: 0.875rem;">
                                    \${session.features_completed} / \${session.features_total} features completed
                                </div>
                            \` : ''}
                        \`;
                        list.appendChild(card);
                    });
                } else {
                    previewContent.innerHTML = '<div class="preview-placeholder"><div class="preview-placeholder-icon">📁</div><h3>No Projects Yet</h3><p>Create a new project to get started!</p></div>';
                }
            } catch (error) {
                console.error('Error loading sessions:', error);
            }
        }

        async function loadSessionsView() {
            const previewContent = document.getElementById('previewContent');
            previewContent.innerHTML = '<div class="sessions-list"></div>';
            await loadSessions();
        }

        async function selectSession(sessionId) {
            currentSessionId = sessionId;
            try {
                const res = await fetch('/api/sessions/' + sessionId);
                const data = await res.json();
                const session = data.session;
                
                const previewContent = document.getElementById('previewContent');
                previewContent.innerHTML = \`
                    <div style="max-width: 800px;">
                        <h2 style="margin-bottom: var(--spacing-lg);">\${session.project_name}</h2>
                        <div class="session-card" style="margin-bottom: var(--spacing-lg);">
                            <div class="status-badge status-\${session.status}">\${session.status}</div>
                            <p style="margin-top: var(--spacing-md); color: var(--text-secondary);">\${session.app_spec || 'No specification provided'}</p>
                        </div>
                        <button class="btn btn-primary" onclick="runSession('\${sessionId}')">Run Agent</button>
                    </div>
                \`;
                
                // Load chat messages
                await loadChatMessages(sessionId);
                if (!chatOpen) toggleChat();
            } catch (error) {
                console.error('Error loading session:', error);
            }
        }

        // Modal functions
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
                        setTimeout(() => selectSession(data.session_id), 500);
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
                    addChatMessage('assistant', 'Agent started! ' + (data.note || ''));
                    loadSessions();
                } else {
                    alert('Error: ' + (data.error || 'Failed to start agent'));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    </script>
</body>
</html>`;
}
