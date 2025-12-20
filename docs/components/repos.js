// Minimal Repos UI: list and create via GitHub API through worker
export default function Repos() {
  return `
    <style>
      .repos-root { padding: 16px; font-family: 'Inter', sans-serif; background: var(--bg-primary); color: var(--text); }
      .repos-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:10px; flex-wrap:wrap; }
      .repos-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px; }
      .repo-card { border:1px solid var(--border); border-radius:12px; padding:12px; background: var(--bg-card); box-shadow: var(--shadow-sm); color: var(--text); }
      .repo-card h3 { margin:0 0 6px 0; font-size:16px; color: var(--text); }
      .repo-meta { color: var(--text-secondary); font-size:13px; margin-bottom:8px; }
      .repo-actions { display:flex; gap:8px; flex-wrap:wrap; }
      .repo-btn { padding:8px 10px; border-radius:10px; border:1px solid var(--border); background: var(--bg-card); cursor:pointer; font-size:13px; color: var(--text); }
      .repo-input { padding:8px; border-radius:10px; border:1px solid var(--border); width:100%; box-sizing:border-box; margin-bottom:8px; background: var(--bg-card); color: var(--text); }
    </style>
    <div class="repos-root">
      <div class="repos-header">
        <div>
          <h2 style="margin:0;font-size:18px; color: var(--text);">Repos</h2>
          <div style="color: var(--text-secondary);font-size:13px;">GitHub + registry</div>
        </div>
        <button id="repo-create" class="repo-btn">+ Create Repo</button>
      </div>
      <div id="repos-list" class="repos-grid"></div>
    </div>
  `;
}

export function init() {
  initRepos();
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  return res.json();
}

async function initRepos() {
  const listEl = document.getElementById('repos-list');
  if (!listEl) return;

  async function loadRepos() {
    const data = await fetchJSON('/api/repos/list');
    const repos = data.repos || [];
    listEl.innerHTML = repos.map(r => `
      <div class="repo-card">
        <h3>${r.name}</h3>
        <div class="repo-meta">${r.private ? 'Private' : 'Public'} · ${r.language || ''}</div>
        <div class="repo-meta">Updated: ${r.updated_at ? new Date(typeof r.updated_at === 'number' ? r.updated_at * 1000 : r.updated_at).toLocaleString() : ''}</div>
        <div class="repo-actions">
          <a class="repo-btn" href="${r.html_url}" target="_blank">Open</a>
          <button class="repo-btn" data-ci="${r.name}">Add CI</button>
        </div>
      </div>
    `).join('') || '<div>No repos found</div>';
  }

  document.getElementById('repo-create')?.addEventListener('click', async () => {
    const name = prompt('Repo name?');
    if (!name) return;
    const description = prompt('Description?') || '';
    const visibility = confirm('Private? OK=Yes, Cancel=No') ? 'private' : 'public';
    const template = prompt('Template? (worker/next/static)', 'worker') || 'worker';
    await fetchJSON('/api/repos/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, visibility, template, actor: 'dashboard' })
    });
    await loadRepos();
  });

  listEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-ci]');
    if (btn) {
      const repo = btn.dataset.ci;
      await fetchJSON('/api/repos/add-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo, owner: 'SamPrimeaux' })
      });
      alert('CI workflow added');
    }
  });

  await loadRepos();
}
