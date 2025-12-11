// Live App Library: repos + projects with icons and status
export default function AppLibrary() {
  return `
    <style>
      .app-lib { padding:20px; font-family:'Inter', sans-serif; color:#0f172a; }
      .app-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px; }
      .app-grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
      .app-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:14px; box-shadow:0 10px 30px rgba(15,23,42,0.08); display:flex; gap:12px; }
      .app-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:18px; flex-shrink:0; }
      .app-title { margin:0; font-size:16px; font-weight:700; }
      .app-meta { color:#64748b; font-size:13px; margin:2px 0; }
      .app-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
      .app-btn { padding:8px 10px; border-radius:10px; border:1px solid #e2e8f0; background:#f8fafc; font-weight:600; text-decoration:none; color:#0f172a; cursor:pointer; }
      .app-btn.primary { background:#0ea5e9; color:#fff; border:none; }
      .progress { width:100%; height:6px; background:#e2e8f0; border-radius:999px; overflow:hidden; margin-top:6px; }
      .progress span { display:block; height:100%; border-radius:999px; background:linear-gradient(90deg,#22c55e,#0ea5e9); }
      .badge { display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:999px; font-size:12px; font-weight:600; }
      .badge.live { background:#ecfdf3; color:#166534; }
      .badge.draft { background:#eef2ff; color:#312e81; }
      .badge.dev { background:#e0f2fe; color:#075985; }
      .badge.processing { background:#fff7ed; color:#c2410c; }
      .badge.private { background:#f1f5f9; color:#0f172a; }
      .badge.public { background:#e0f2fe; color:#075985; }
      .count { color:#475569; font-size:13px; }
      .filters { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:10px; }
      .chip { padding:8px 10px; border-radius:10px; border:1px solid #e2e8f0; background:#f8fafc; cursor:pointer; }
      .chip.active { background:#0ea5e9; color:#fff; border-color:#0ea5e9; }
      .paging { display:flex; gap:8px; align-items:center; margin-top:10px; }
      .search { padding:8px 10px; border-radius:10px; border:1px solid #e2e8f0; min-width:200px; }
    </style>
    <div class="app-lib">
      <div class="app-header">
        <div>
          <h2 style="margin:0;">MeauxLife App Library</h2>
          <p style="margin:2px 0 0; color:#64748b;">Unified control across GitHub, R2, and deployments.</p>
        </div>
        <div class="count" id="app-count"></div>
      </div>
      <div class="filters">
        <input id="app-search" class="search" placeholder="Search..." />
        <div>
          <span class="chip active" data-filter="all">All</span>
          <span class="chip" data-filter="repo">Repos</span>
          <span class="chip" data-filter="project">Projects</span>
        </div>
        <div>
          <span class="chip active" data-status="all">Any Status</span>
          <span class="chip" data-status="dev">Dev</span>
          <span class="chip" data-status="processing">Processing</span>
          <span class="chip" data-status="deployed">Deployed</span>
        </div>
        <div>
          <select id="app-sort" class="chip" style="border-color:#e2e8f0;">
            <option value="updated">Sort: Updated</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>
      <div class="app-grid" id="app-grid"></div>
      <div class="paging">
        <button id="app-prev" class="chip">Prev</button>
        <span id="app-page" style="color:#475569;font-size:12px;">1</span>
        <button id="app-next" class="chip">Next</button>
      </div>
    </div>
  `;
}

export async function init() {
  const grid = document.getElementById('app-grid');
  const countEl = document.getElementById('app-count');
  const searchEl = document.getElementById('app-search');
  const sortEl = document.getElementById('app-sort');
  const prevEl = document.getElementById('app-prev');
  const nextEl = document.getElementById('app-next');
  const pageEl = document.getElementById('app-page');
  if (!grid) return;
  let allCards = [];
  let page = 1;
  const pageSize = 20;
  let typeFilter = 'all';
  let statusFilter = 'all';

  try {
    const [reposData, projectsData] = await Promise.all([
      fetchJson('/api/repos/list'),
      fetchJson('/api/projects')
    ]);
    const repos = (reposData.repos || []).slice(0, 20);
    const projects = (projectsData.projects || []).slice(0, 20);

    const cards = [];
    repos.forEach(r => {
      cards.push({
        type: 'repo',
        name: r.name,
        visibility: r.private ? 'private' : 'public',
        updated: r.updated_at,
        language: r.language,
        url: r.html_url,
        icon: iconFor(r.name),
        status: 'dev',
        progress: completionFromRepo(r)
      });
    });
    projects.forEach(p => {
      cards.push({
        type: 'project',
        name: p.name,
        visibility: 'private',
        updated: p.updated_at,
        language: p.type || p.project_type,
        url: p.deployment_url || '',
        icon: iconFor(p.name),
        status: p.status || 'processing',
        progress: p.status === 'deployed' ? 100 : 60
      });
    });

    if (countEl) countEl.textContent = `${cards.length} apps`;
    allCards = cards;
    render();
    wireFilters();
  } catch (err) {
    grid.innerHTML = `<div style="color:#ef4444;">Failed to load apps</div>`;
    console.error(err);
  }

  function render() {
    let list = [...allCards];
    const q = (searchEl?.value || '').toLowerCase();
    if (typeFilter !== 'all') list = list.filter(c => c.type === typeFilter);
    if (statusFilter !== 'all') list = list.filter(c => (c.status || '').toLowerCase().includes(statusFilter));
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q));
    if (sortEl?.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime());
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    page = Math.min(page, totalPages);
    const start = (page - 1) * pageSize;
    const pageItems = list.slice(start, start + pageSize);
    grid.innerHTML = pageItems.map(cardTemplate).join('') || '<div>No apps found.</div>';
    grid.querySelectorAll('[data-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.open;
        if (url) window.open(url, '_blank');
      });
    });
    if (pageEl) pageEl.textContent = `${page} / ${totalPages}`;
  }

  function wireFilters() {
    document.querySelectorAll('[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        typeFilter = chip.dataset.filter || 'all';
        page = 1;
        render();
      });
    });
    document.querySelectorAll('[data-status]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-status]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        statusFilter = chip.dataset.status || 'all';
        page = 1;
        render();
      });
    });
    searchEl?.addEventListener('input', () => { page = 1; render(); });
    sortEl?.addEventListener('change', () => { render(); });
    prevEl?.addEventListener('click', () => { if (page > 1) { page--; render(); } });
    nextEl?.addEventListener('click', () => { page++; render(); });
  }
}

function cardTemplate(app) {
  const statusClass = app.status === 'deployed' ? 'live' : app.status === 'processing' ? 'processing' : 'dev';
  return `
    <div class="app-card">
      <div class="app-icon" style="background:${app.icon.bg}; border:1px solid rgba(0,0,0,0.04);">
        ${app.icon.svg}
      </div>
      <div style="flex:1;">
        <h3 class="app-title">${app.name}</h3>
        <div class="app-meta">
          <span class="badge ${app.visibility}">${app.visibility}</span>
          <span class="badge ${statusClass}">${app.status || 'dev'}</span>
          ${app.language ? ` · ${app.language}` : ''}
          ${app.updated ? ` · ${new Date(app.updated).toLocaleString()}` : ''}
        </div>
        <div class="progress"><span style="width:${Math.min(100, app.progress)}%"></span></div>
        <div class="app-actions">
          ${app.url ? `<button class="app-btn primary" data-open="${app.url}">Open</button>` : ''}
          <button class="app-btn" onclick="window.router.navigate('/dashboard/upload')">Deploy</button>
        </div>
      </div>
    </div>
  `;
}

function iconFor(name = '') {
  const colors = ['#0ea5e9', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'];
  const base = colors[name.length % colors.length];
  const bg = shade(base, -15);
  const gradientId = `g-${name.replace(/[^a-z0-9]/gi, '') || 'app'}`;
  const svg = `
    <svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${base}"/>
          <stop offset="100%" stop-color="${shade(base, -20)}"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#${gradientId})"/>
      <circle cx="22" cy="22" r="6" fill="rgba(255,255,255,0.85)"/>
      <circle cx="42" cy="22" r="6" fill="rgba(255,255,255,0.75)"/>
      <path d="M18 40c6 4 22 4 28 0" stroke="rgba(255,255,255,0.8)" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>
  `;
  return { bg, label: name.slice(0, 2).toUpperCase(), svg };
}

function completionFromRepo(r) {
  let c = 30;
  if (r.stargazers_count > 0) c += 10;
  if (r.language) c += 10;
  if (r.updated_at && (Date.now() - new Date(r.updated_at).getTime()) < 14 * 86400000) c += 20;
  return Math.min(100, c);
}

async function fetchJson(url) { const res = await fetch(url); if (!res.ok) throw new Error('Failed ' + url); return res.json(); }

function shade(color, percent) {
  const num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}
