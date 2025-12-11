// Home Overview Dashboard - pulls live data from worker APIs
export default function Home() {
  return `
    <style>
      .home-wrap { padding: 20px; font-family: 'Inter', sans-serif; color: #0f172a; }
      .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
      .api-status { display:flex; gap:10px; align-items:center; flex-wrap:wrap; background:#0f172a; color:white; padding:10px 14px; border-radius:12px; }
      .api-chip { display:flex; gap:6px; align-items:center; padding:6px 10px; border-radius:10px; background:rgba(255,255,255,0.08); }
      .dot { width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block; }
      .home-grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
      .hero-card, .panel { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; box-shadow:0 12px 40px rgba(15,23,42,0.06); }
      .hero-card h4 { margin:0; font-size:13px; color:#64748b; text-transform:uppercase; letter-spacing:0.6px; }
      .hero-value { font-size:28px; font-weight:800; margin:6px 0; }
      .hero-meta { color:#475569; font-size:13px; }
      .quick-grid { display:grid; gap:10px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
      .quick { display:flex; gap:10px; align-items:center; padding:12px; border-radius:12px; border:1px solid #e2e8f0; background:#f8fafc; cursor:pointer; }
      .quick-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#0ea5e910; color:#0ea5e9; font-size:18px; }
      .section-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
      .section-head h3 { margin:0; font-size:16px; }
      .list { display:flex; flex-direction:column; gap:10px; max-height:320px; overflow:auto; }
      .list-item { padding:10px; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc; display:flex; justify-content:space-between; gap:8px; }
      .pill { padding:4px 10px; border-radius:999px; background:#eef2ff; color:#312e81; font-weight:600; font-size:12px; }
      .status { display:flex; flex-direction:column; gap:8px; }
      .status-row { display:flex; justify-content:space-between; align-items:center; }
      .skeleton { background:linear-gradient(90deg,#eef2f6 25%,#e5e7eb 50%,#eef2f6 75%); background-size:200% 100%; animation:shimmer 1.2s ease-in-out infinite; border-radius:8px; }
      @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
      @media (max-width: 768px) { .home-grid { grid-template-columns:1fr; } }
    </style>
    <div class="home-wrap">
      <div class="topbar">
        <div class="api-status" id="api-status-bar">
          <div style="font-weight:700;">API Status</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="quick" style="padding:10px 12px;" id="help-btn">
            <div class="quick-icon">?</div>
            <div><div style="font-weight:700;">Help</div><div style="color:#475569;font-size:12px;">Shortcuts & docs</div></div>
          </button>
        </div>
      </div>

      <div class="home-grid" id="hero-grid"></div>

      <div class="panel" style="margin:14px 0;">
        <div class="section-head"><h3>Quick Actions</h3><span id="refresh-at" style="color:#475569;font-size:12px;"></span></div>
        <div class="quick-grid">
          ${quickButton('➕', 'New Project', 'Start tracking work', "window.router.navigate('/dashboard/kanban')")}
          ${quickButton('☁️', 'Upload to R2', 'Storage', "window.router.navigate('/dashboard/r2')")}
          ${quickButton('⚙️', 'Terminal', 'Run commands', "window.router.navigate('/dashboard/command')")}
          ${quickButton('💬', 'Team Chat', 'Open chat', "window.router.navigate('/dashboard/chat-lite')")}
          ${quickButton('🔑', 'API Keys', 'Manage access', "window.router.navigate('/dashboard')")}
          ${quickButton('📈', 'Analytics', 'Usage reports', "window.router.navigate('/dashboard')")}
        </div>
      </div>

      <div class="home-grid">
        <div class="panel">
          <div class="section-head"><h3>Recent Activity</h3><button class="quick" style="padding:6px 10px;" id="refresh-activity">Refresh</button></div>
          <div class="list" id="activity-list"></div>
        </div>
        <div class="panel">
          <div class="section-head"><h3>System Health</h3></div>
          <div class="status" id="health-widgets"></div>
        </div>
      </div>

      <div class="home-grid" style="margin-top:14px;">
        <div class="panel">
          <div class="section-head"><h3>Projects</h3></div>
          <div class="list" id="home-projects"></div>
        </div>
        <div class="panel">
          <div class="section-head"><h3>Kanban Tasks</h3></div>
          <div class="list" id="home-tasks"></div>
        </div>
        <div class="panel">
          <div class="section-head"><h3>Chat</h3></div>
          <div class="list" id="home-chat"></div>
        </div>
        <div class="panel">
          <div class="section-head"><h3>Repos</h3></div>
          <div class="list" id="home-repos"></div>
        </div>
      </div>
    </div>

    <div id="help-modal" style="position:fixed; inset:0; background:rgba(15,23,42,0.45); display:none; align-items:center; justify-content:center; z-index:1000;">
      <div style="background:#fff; border-radius:16px; padding:18px; width:420px; max-width:90%; box-shadow:0 20px 70px rgba(0,0,0,0.2);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h3 style="margin:0;">Dashboard Help</h3>
          <button id="help-close" style="border:none; background:#e2e8f0; border-radius:8px; padding:6px 10px; cursor:pointer;">Close</button>
        </div>
        <ul style="margin:0; padding-left:18px; color:#475569; font-size:14px; display:flex; flex-direction:column; gap:6px;">
          <li>⌘/Ctrl + K: Command palette</li>
          <li>Realtime: tasks, chat, repos, uploads</li>
          <li>Use R2 view for assets and gallery for media</li>
        </ul>
      </div>
    </div>
  `;
}

export async function init() {
  bindHelp();
  document.getElementById('refresh-activity')?.addEventListener('click', () => loadAll(true));
  await loadAll();
  connectRealtime(['kanban', 'chat', 'repos', 'uploads'], () => loadAll(true));
}

function quickButton(icon, title, desc, onclick) {
  return `<div class="quick" onclick="${onclick}">
    <div class="quick-icon">${icon}</div>
    <div><div style="font-weight:700;">${title}</div><div style="color:#475569;font-size:12px;">${desc}</div></div>
  </div>`;
}

async function loadAll(showSkeleton = false) {
  if (showSkeleton) showLoaders();
  try {
    const [health, r2, activity, tasks, chat, repos, projects, online] = await Promise.all([
      fetchJson('/api/health/extended'),
      fetchJson('/api/r2/usage'),
      fetchJson('/api/activity'),
      fetchTasks(),
      fetchChatMessages(),
      fetchJson('/api/repos/list'),
      fetchJson('/api/projects'),
      fetchJson('/api/chat/online')
    ]);
    renderApiStatus(health?.services || []);
    renderHero(health, r2, tasks, chat, repos, projects, online);
    renderActivity(activity);
    renderHealth(health, r2);
    renderProjects(projects);
    renderTasks(tasks);
    renderChat(chat);
    renderRepos(repos);
    document.getElementById('refresh-at').textContent = `Updated ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    console.error('home load error', e);
  } finally {
    hideLoaders();
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}`);
  return res.json();
}

async function fetchTasks() {
  const columnId = await firstColumn();
  if (!columnId) return [];
  return fetchJson('/api/kanban/tasks?columnId=' + encodeURIComponent(columnId));
}

async function fetchChatMessages() {
  const convo = await firstConversation();
  if (!convo) return [];
  return fetchJson('/api/chat/messages?conversationId=' + encodeURIComponent(convo) + '&limit=10');
}

async function firstColumn() {
  const boards = await fetchJson('/api/kanban/boards');
  if (!boards.length) return '';
  const cols = await fetchJson('/api/kanban/columns?boardId=' + encodeURIComponent(boards[0].id));
  return cols[0]?.id || '';
}

async function firstConversation() {
  const convos = await fetchJson('/api/chat/conversations');
  return convos[0]?.id || '';
}

function renderApiStatus(services) {
  const bar = document.getElementById('api-status-bar');
  if (!bar) return;
  const chips = services.map(s => {
    const healthy = s.status === 'healthy';
    return `<div class="api-chip">
      <span class="dot" style="background:${healthy ? '#10b981' : '#f97316'};"></span>
      <span>${s.name}</span>
      <span style="color:#cbd5e1;font-size:12px;">${s.latency || 0}ms${s.code ? ` · ${s.code}` : ''}</span>
    </div>`;
  }).join('');
  bar.innerHTML = `<div style="font-weight:700;">API Status</div>${chips || '<div style="color:#cbd5e1;">No checks</div>'}`;
}

function renderHero(health, r2, tasks, chat, repos, projects, online) {
  const el = document.getElementById('hero-grid');
  if (!el) return;
  const hero = [
    { label: 'Active Projects', value: projects?.projects?.length || 0, meta: `${(tasks || []).length} tasks`, link: '/dashboard/kanban' },
    { label: 'API Health', value: `${healthyPercent(health?.services)}%`, meta: 'Checks: OpenAI, Anthropic, Resend, CF', link: '/dashboard' },
    { label: 'R2 Usage', value: formatBytes(r2?.totalBytes || 0), meta: `${r2?.buckets?.length || 0} buckets`, link: '/dashboard/r2' },
    { label: 'Team Online', value: online?.online?.length || 0, meta: (online?.online || []).map(o => o.name).slice(0, 3).join(', ') || 'recent senders', link: '/dashboard/chat-lite' },
  ];
  el.innerHTML = hero.map(h => `
    <div class="hero-card" onclick="window.router.navigate('${h.link}')">
      <h4>${h.label}</h4>
      <div class="hero-value">${h.value}</div>
      <div class="hero-meta">${h.meta}</div>
    </div>
  `).join('');
}

function renderActivity(data) {
  const el = document.getElementById('activity-list');
  if (!el) return;
  const list = data?.events || [];
  el.innerHTML = list.slice(0, 12).map(ev => `
    <div class="list-item">
      <div>
        <div style="font-weight:700;">${ev.title}</div>
        <div style="color:#475569;font-size:12px;">${ev.type} · ${ev.actor}</div>
      </div>
      <div style="color:#94a3b8;font-size:12px;">${ev.ts ? new Date(ev.ts).toLocaleTimeString() : ''}</div>
    </div>
  `).join('') || '<div class="list-item">No recent activity.</div>';
}

function renderHealth(health, r2) {
  const el = document.getElementById('health-widgets');
  if (!el) return;
  const widgets = [];
  widgets.push({
    title: 'API Services',
    status: `${healthyPercent(health?.services)}% healthy`,
    rows: (health?.services || []).map(s => ({ label: s.name, value: `${s.latency || 0}ms`, status: s.status === 'healthy' }))
  });
  widgets.push({
    title: 'R2 Storage',
    status: formatBytes(r2?.totalBytes || 0),
    rows: (r2?.buckets || []).slice(0, 4).map(b => ({ label: b.name, value: `${formatBytes(b.bytes)} · ${b.objects || 0} objects`, status: true }))
  });
  widgets.push({
    title: 'D1',
    status: `${health?.d1?.tasks || 0} tasks · ${health?.d1?.messages || 0} msgs`,
    rows: [
      { label: 'Tasks', value: `${health?.d1?.tasks || 0}`, status: true },
      { label: 'Messages', value: `${health?.d1?.messages || 0}`, status: true },
      { label: 'Repos', value: `${health?.d1?.repos || 0}`, status: true },
    ]
  });
  el.innerHTML = widgets.map(w => `
    <div style="border:1px solid #e2e8f0; border-radius:12px; padding:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:700;">${w.title}</div>
        <div class="pill" style="background:#ecfeff; color:#0ea5e9;">${w.status}</div>
      </div>
      <div style="margin-top:10px; display:flex; flex-direction:column; gap:8px;">
        ${w.rows.map(r => `<div class="status-row"><span>${r.label}</span><span style="display:flex; gap:6px; align-items:center;"><span class="dot" style="background:${r.status ? '#10b981' : '#f97316'};"></span>${r.value}</span></div>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects(data) {
  const el = document.getElementById('home-projects');
  if (!el) return;
  const list = data?.projects || [];
  el.innerHTML = list.slice(0, 5).map(p => `
    <div class="list-item">
      <div>
        <div style="font-weight:700;">${p.name}</div>
        <div style="color:#64748b;font-size:12px;">${p.status || 'pending'} · ${p.type || p.project_type || ''}</div>
      </div>
      <div class="pill">${p.status || 'pending'}</div>
    </div>
  `).join('') || '<div class="list-item">No projects yet.</div>';
}

function renderTasks(data) {
  const el = document.getElementById('home-tasks');
  if (!el) return;
  const list = data || [];
  el.innerHTML = list.slice(0, 5).map(t => `
    <div class="list-item">
      <div>
        <div style="font-weight:700;">${t.title}</div>
        <div style="color:#64748b;font-size:12px;">${t.priority || 'normal'} · ${t.assignee || 'unassigned'}</div>
      </div>
      <div style="color:#94a3b8;font-size:12px;">${t.updated_at ? new Date(t.updated_at).toLocaleTimeString() : ''}</div>
    </div>
  `).join('') || '<div class="list-item">No tasks yet.</div>';
}

function renderChat(data) {
  const el = document.getElementById('home-chat');
  if (!el) return;
  const list = data || [];
  el.innerHTML = list.slice(0, 5).map(m => `
    <div class="list-item">
      <div>
        <div style="font-weight:700;">${m.author || 'anon'}</div>
        <div style="color:#64748b;font-size:12px;">${m.text}</div>
      </div>
      <div style="color:#94a3b8;font-size:11px;">${m.created_at ? new Date(m.created_at).toLocaleTimeString() : ''}</div>
    </div>
  `).join('') || '<div class="list-item">No messages yet.</div>';
}

function renderRepos(data) {
  const el = document.getElementById('home-repos');
  if (!el) return;
  const list = data?.repos || [];
  el.innerHTML = list.slice(0, 5).map(r => `
    <div class="list-item">
      <div>
        <div style="font-weight:700;">${r.name}</div>
        <div style="color:#64748b;font-size:12px;">${r.private ? 'Private' : 'Public'} · ${r.language || ''}</div>
      </div>
      <div style="color:#94a3b8;font-size:11px;">${r.updated_at ? new Date(r.updated_at).toLocaleString() : ''}</div>
    </div>
  `).join('') || '<div class="list-item">No repos.</div>';
}

function healthyPercent(services = []) {
  if (!services.length) return 0;
  const healthy = services.filter(s => s.status === 'healthy').length;
  return Math.round((healthy / services.length) * 100);
}

function formatBytes(bytes = 0) { if (bytes === 0) return '0 B'; const k = 1024; const units = ['B', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); const num = bytes / Math.pow(k, i); return `${num.toFixed(num >= 10 ? 0 : 2)} ${units[i]}`; }

function showLoaders() {
  const targets = ['hero-grid', 'activity-list', 'health-widgets', 'home-projects', 'home-tasks', 'home-chat', 'home-repos'];
  targets.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = '<div class="skeleton" style="height:120px; width:100%;"></div>';
    }
  });
}

function hideLoaders() {
  // no-op; actual content replaces loaders
}

function connectRealtime(channels, onMessage) {
  try {
    const ws = new WebSocket(`${location.origin.replace('http', 'ws')}/api/realtime`);
    ws.addEventListener('open', () => {
      channels.forEach(channel => {
        ws.send(JSON.stringify({ type: 'subscribe', channel }));
      });
    });
    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (channels.includes(data.channel) || data.channel === 'all') {
          onMessage && onMessage(data);
        }
      } catch (e) { /* ignore */ }
    });
    ws.addEventListener('error', () => ws.close());
    ws.addEventListener('close', () => setTimeout(() => connectRealtime(channels, onMessage), 2000));
  } catch (e) {
    console.warn('realtime connect failed', e);
  }
}

function bindHelp() {
  const modal = document.getElementById('help-modal');
  document.getElementById('help-btn')?.addEventListener('click', () => modal && (modal.style.display = 'flex'));
  document.getElementById('help-close')?.addEventListener('click', () => modal && (modal.style.display = 'none'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}
