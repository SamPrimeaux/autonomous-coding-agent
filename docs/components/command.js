// Command palette placeholder: quick links
export default function Command() {
  return `
    <style>
      .cmd-wrap { padding: 20px; font-family:'Inter', sans-serif; color:#0f172a; }
      .cmd-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:16px; box-shadow:0 10px 30px rgba(15,23,42,0.08); }
      .cmd-input { width:100%; padding:12px; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; }
      .cmd-list a { display:block; padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0; text-decoration:none; color:#0f172a; margin-bottom:8px; }
      .cmd-list a:hover { background:#f8fafc; }
      .suggestions { margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0; display:flex; flex-direction:column; gap:8px; }
      .suggestion { padding:10px 12px; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; justify-content:space-between; gap:8px; cursor:pointer; }
      .suggestion small { color:#475569; }
    </style>
    <div class="cmd-wrap">
      <h2 style="margin:0 0 8px;">Command Palette</h2>
      <p style="margin:0 0 12px; color:#475569;">Jump to features or run quick actions.</p>
      <div class="cmd-card">
        <input id="cmd-search" class="cmd-input" placeholder="Type: r2, upload, kanban, chat, repos, terminal..." />
        <div class="cmd-list" id="cmd-list">${commands().map(c => `<a href="${c.route}" data-route="${c.route}">${c.label}</a>`).join('')}</div>
        <div class="suggestions" id="cmd-suggestions"></div>
      </div>
    </div>
  `;
}

export function init() {
  const input = document.getElementById('cmd-search');
  const list = document.getElementById('cmd-list');
  const sug = document.getElementById('cmd-suggestions');
  if (!input || !list) return;
  const data = commands();
  let cachedSuggestions = [];

  fetchSuggestions().then(items => {
    cachedSuggestions = items;
    renderSuggestions(sug, cachedSuggestions);
  }).catch(() => { });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    list.innerHTML = data
      .filter(c => c.label.toLowerCase().includes(q))
      .map(c => `<a href="${c.route}" data-route="${c.route}">${c.label}</a>`).join('');
    if (q.trim() === '/' || q.trim() === '') {
      renderSuggestions(sug, cachedSuggestions);
    } else {
      renderSuggestions(sug, cachedSuggestions.filter(s => s.label.toLowerCase().includes(q)));
    }
  });

  // Auto-trigger suggestions when focusing with "/"
  input.addEventListener('focus', () => {
    if (!input.value) input.value = '/';
    renderSuggestions(sug, cachedSuggestions);
  });
}

function commands() {
  return [
    { label: 'Home', route: '/' },
    { label: 'R2 Storage', route: '/dashboard/r2' },
    { label: 'Smart Upload', route: '/dashboard/upload' },
    { label: 'Kanban', route: '/dashboard/kanban' },
    { label: 'Chat', route: '/dashboard/chat-lite' },
    { label: 'Repos', route: '/dashboard/repos' },
    { label: 'Terminal', route: '/dashboard/terminal' },
    { label: 'Workflows', route: '/dashboard/workflows' }
  ];
}

async function fetchSuggestions() {
  try {
    const [health, activity, r2] = await Promise.all([
      fetchJson('/api/health/extended'),
      fetchJson('/api/activity'),
      fetchJson('/api/r2/usage'),
    ]);
    const suggestions = [];
    const apiHealthy = healthyPercent(health?.services);
    if (apiHealthy < 100) {
      suggestions.push({ label: 'Check API health', detail: `${apiHealthy}% healthy`, route: '/dashboard' });
    }
    if ((r2?.totalBytes || 0) > 0) {
      suggestions.push({ label: 'Review R2 usage', detail: `${formatBytes(r2.totalBytes)} across ${r2?.buckets?.length || 0} buckets`, route: '/dashboard/r2' });
    }
    const latest = (activity?.events || [])[0];
    if (latest) {
      suggestions.push({ label: 'Latest activity', detail: `${latest.type}: ${latest.title}`, route: '/dashboard/kanban' });
    }
    suggestions.push({ label: 'Open Chat', detail: 'Coordinate next steps', route: '/dashboard/chat-lite' });
    suggestions.push({ label: 'Create task', detail: 'Add to Kanban', route: '/dashboard/kanban' });
    return suggestions.slice(0, 5);
  } catch (e) {
    return [
      { label: 'Open Kanban', detail: 'Plan next tasks', route: '/dashboard/kanban' },
      { label: 'Open Chat', detail: 'Coordinate with team', route: '/dashboard/chat-lite' },
      { label: 'Upload to R2', detail: 'Manage assets', route: '/dashboard/r2' },
    ];
  }
}

function renderSuggestions(el, items) {
  if (!el) return;
  if (!items || !items.length) {
    el.innerHTML = '<div style="color:#94a3b8;font-size:12px;">No suggestions.</div>';
    return;
  }
  el.innerHTML = items.map(s => `<div class="suggestion" onclick="window.router.navigate('${s.route}')">
    <div>
      <div style="font-weight:700;">${s.label}</div>
      <small>${s.detail || ''}</small>
    </div>
    <span style="color:#0ea5e9;">↪</span>
  </div>`).join('');
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('failed ' + url);
  return res.json();
}

function healthyPercent(services = []) {
  if (!services.length) return 0;
  const healthy = services.filter(s => s.status === 'healthy').length;
  return Math.round((healthy / services.length) * 100);
}

function formatBytes(bytes = 0) { if (bytes === 0) return '0 B'; const k = 1024; const units = ['B', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); const num = bytes / Math.pow(k, i); return `${num.toFixed(num >= 10 ? 0 : 2)} ${units[i]}`; }
