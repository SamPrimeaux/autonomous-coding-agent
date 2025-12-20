// File Manager: quick links to R2, uploads, and projects
export default function FileManager() {
  return `
    <style>
      .fm-wrap { padding: 20px; font-family: 'Inter', sans-serif; background: var(--bg-primary); color: var(--text); }
      .fm-layout { display:grid; grid-template-columns: 260px 1fr; gap:14px; }
      .fm-pane { background: var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:14px; box-shadow: var(--shadow-md); }
      .fm-list { list-style:none; padding:0; margin:0; max-height:70vh; overflow:auto; }
      .fm-list li { padding:10px; border-radius:10px; cursor:pointer; color: var(--text); }
      .fm-list li:hover { background: var(--bg-hover); }
      .fm-list li.active { background: rgba(31, 151, 169, 0.15); color: var(--primary); }
      .fm-objects { width:100%; border-collapse: collapse; }
      .fm-objects th, .fm-objects td { padding:8px; border-bottom:1px solid var(--border); text-align:left; font-size:13px; color: var(--text); }
      .fm-toolbar { display:flex; gap:8px; align-items:center; margin-bottom:10px; }
      .fm-input { padding:8px; border-radius:10px; border:1px solid var(--border); width:100%; background: var(--bg-card); color: var(--text); }
      .fm-btn { padding:8px 10px; border-radius:10px; border:1px solid var(--border); background: var(--primary); color:white; font-weight:600; cursor:pointer; }
    </style>
    <div class="fm-wrap">
      <h2 style="margin:0 0 8px;">File Manager</h2>
      <p style="margin:0 0 12px; color: var(--text-secondary);">Browse R2 buckets and objects inline. For advanced ops, open R2 dashboard.</p>
      <div class="fm-layout">
        <div class="fm-pane">
          <h3 style="margin:0 0 8px;">Buckets</h3>
          <ul class="fm-list" id="fm-buckets"></ul>
        </div>
        <div class="fm-pane">
          <div class="fm-toolbar">
            <input id="fm-search" class="fm-input" placeholder="Search objects..." />
            <button class="fm-btn" id="fm-refresh">Refresh</button>
            <a class="fm-btn" href="/dashboard/r2" data-route="/dashboard/r2" style="background:#1e293b;border-color:#1e293b;">Open R2</a>
          </div>
          <div id="fm-empty" style="color: var(--text-secondary);">Select a bucket to view objects.</div>
          <div id="fm-objects-wrap" style="display:none; overflow:auto; max-height:70vh;">
            <table class="fm-objects">
              <thead><tr><th>Key</th><th>Size</th><th>Uploaded</th></tr></thead>
              <tbody id="fm-objects"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  initFileManager();
}

async function initFileManager() {
  const bucketsEl = document.getElementById('fm-buckets');
  const objectsWrap = document.getElementById('fm-objects-wrap');
  const objectsBody = document.getElementById('fm-objects');
  const emptyEl = document.getElementById('fm-empty');
  const refreshBtn = document.getElementById('fm-refresh');
  const searchInput = document.getElementById('fm-search');
  if (!bucketsEl || !objectsBody) return;

  let buckets = [];
  let currentBucket = null;
  let objects = [];

  async function loadBuckets() {
    const data = await fetchJSON('/api/r2/buckets');
    buckets = data.buckets || data.result || [];
    bucketsEl.innerHTML = buckets.map(b => `<li data-bucket="${b.name}">${b.name}</li>`).join('') || '<li>No buckets</li>';
    bucketsEl.querySelectorAll('li').forEach(li => {
      li.onclick = () => selectBucket(li.dataset.bucket);
    });
    if (buckets[0]) selectBucket(buckets[0].name);
  }

  async function selectBucket(name) {
    currentBucket = name;
    bucketsEl.querySelectorAll('li').forEach(li => li.classList.toggle('active', li.dataset.bucket === name));
    emptyEl.style.display = 'none';
    objectsWrap.style.display = 'block';
    await loadObjects();
  }

  async function loadObjects() {
    if (!currentBucket) return;
    const data = await fetchJSON(`/api/r2/buckets/${encodeURIComponent(currentBucket)}/objects?limit=200`);
    objects = data.objects || [];
    renderObjects();
  }

  function renderObjects() {
    const q = (searchInput.value || '').toLowerCase();
    const filtered = objects.filter(o => (o.key || '').toLowerCase().includes(q));
    objectsBody.innerHTML = filtered.map(o => `
      <tr>
        <td>${o.key}</td>
        <td>${formatBytes(o.size || o.size_bytes || 0)}</td>
        <td>${o.uploaded ? new Date(typeof o.uploaded === 'number' ? o.uploaded * 1000 : o.uploaded).toLocaleString() : ''}</td>
      </tr>
    `).join('') || `<tr><td colspan="3">No objects</td></tr>`;
  }

  searchInput?.addEventListener('input', () => renderObjects());
  refreshBtn?.addEventListener('click', () => loadObjects());

  await loadBuckets();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

function formatBytes(bytes = 0) { if (bytes === 0) return '0 B'; const k = 1024; const units = ['B', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); const num = bytes / Math.pow(k, i); return `${num.toFixed(num >= 10 ? 0 : 2)} ${units[i]}`; }
let sortBy = 'name';
let sortOrder = 'asc';
let filterType = 'all';
let searchQuery = '';

export default function FileManager() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">File Manager</h1>
      <p class="page-subtitle">Manage and organize your files</p>
    </div>
    <div style="padding: 0; max-width: 1800px; margin: 0 auto;">
      <!-- Header -->
      <div style="margin-bottom: 32px; display: none;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; letter-spacing: -0.02em;">
              File Manager
            </h1>
            <p style="font-size: 14px; color: var(--text-secondary); font-weight: 400;">
              Browse, sort, and manage your files across the platform
            </p>
          </div>
          <button class="btn btn-primary" id="refresh-files" style="margin-left: auto;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-label">Total Files</div>
          <div class="stat-value" id="total-files">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Duplicates</div>
          <div class="stat-value" id="duplicate-count" style="color: var(--warning);">0</div>
          <div class="stat-change" id="duplicate-change"></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Size</div>
          <div class="stat-value" id="total-size">0 KB</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Selected</div>
          <div class="stat-value" id="selected-stat" style="font-size: 24px;">0</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="card card-compact" style="margin-bottom: 20px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <!-- Search -->
          <div style="flex: 1; min-width: 280px; position: relative;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="2" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none;">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              id="file-search" 
              placeholder="Search files by name or path..." 
              class="input"
              style="padding-left: 36px;"
            />
          </div>
          
          <!-- Filter by type -->
          <select id="file-type-filter" class="select" style="min-width: 140px;">
            <option value="all">All Types</option>
            <option value=".js">JavaScript</option>
            <option value=".ts">TypeScript</option>
            <option value=".html">HTML</option>
            <option value=".css">CSS</option>
            <option value=".md">Markdown</option>
            <option value=".json">JSON</option>
            <option value=".txt">Text</option>
            <option value=".png">Images</option>
            <option value=".jpg">Images</option>
          </select>
          
          <!-- Sort -->
          <select id="file-sort" class="select" style="min-width: 160px;">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="size-asc">Size (Smallest)</option>
            <option value="size-desc">Size (Largest)</option>
          </select>
          
          <!-- Cleanup Button -->
          <button class="btn btn-danger" id="cleanup-duplicates" style="display: none;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clean Duplicates
          </button>
        </div>
      </div>

      <!-- File List -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-header" style="padding: 12px 20px;">
          <div style="display: grid; grid-template-columns: 40px 2fr 1.5fr 100px 100px 140px; gap: 20px; align-items: center;">
            <div></div>
            <div>Name</div>
            <div>Path</div>
            <div>Type</div>
            <div>Size</div>
            <div>Modified</div>
          </div>
        </div>
        <div id="file-list" style="max-height: calc(100vh - 500px); min-height: 400px; overflow-y: auto;">
          <div style="padding: 60px 20px; text-align: center; color: var(--text-muted);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" style="margin: 0 auto 16px; opacity: 0.6;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            <div style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">Loading files...</div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions (when files selected) -->
      <div id="bulk-actions" style="display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-elevated); padding: 16px 24px; border-radius: 12px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); z-index: 1000; backdrop-filter: blur(10px);">
        <div style="display: flex; gap: 12px; align-items: center;">
          <span id="selected-count" style="font-weight: 600; color: var(--text); font-size: 14px;">0 files selected</span>
          <div style="width: 1px; height: 24px; background: var(--border);"></div>
          <button class="btn btn-ghost" id="select-all" style="font-size: 13px;">Select All</button>
          <button class="btn btn-danger" id="delete-selected" style="font-size: 13px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
          </button>
          <button class="btn btn-ghost" id="clear-selection" style="font-size: 13px;">Clear</button>
        </div>
      </div>
    </div>
  `;
}

export async function init() {
  await loadFiles();
  renderFiles();
  setupEventListeners();
  checkDuplicates();
}

async function loadFiles() {
  try {
    // Load from D1 files table
    const response = await fetch('/api/files');
    if (response.ok) {
      files = await response.json();
    } else {
      // Fallback: try to list from R2 (would need API endpoint)
      files = [];
    }
  } catch (error) {
    console.error('Failed to load files:', error);
    files = [];
  }
}

function renderFiles() {
  const container = document.getElementById('file-list');
  if (!container) return;

  // Apply filters and sorting
  let filtered = [...files];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(file =>
      file.name.toLowerCase().includes(query) ||
      (file.path && file.path.toLowerCase().includes(query))
    );
  }

  // Type filter
  if (filterType !== 'all') {
    filtered = filtered.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return file.name.toLowerCase().endsWith(filterType.toLowerCase());
    });
  }

  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      const dateA = new Date(a.updated_at || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.created_at || 0);
      comparison = dateA - dateB;
    } else if (sortBy === 'size') {
      const sizeA = (a.size || a.content?.length || 0);
      const sizeB = (b.size || b.content?.length || 0);
      comparison = sizeA - sizeB;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Update stats
  document.getElementById('total-files').textContent = files.length.toLocaleString();
  document.getElementById('total-size').textContent = formatSize(
    files.reduce((sum, f) => sum + (f.size || f.content?.length || 0), 0)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-muted);"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" style="margin: 0 auto 16px; opacity: 0.5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><div style="font-size: 14px; color: var(--text-secondary);">No files found</div></div>';
    return;
  }

  container.innerHTML = filtered.map((file, index) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const icon = getFileIcon(ext);
    const size = file.size || file.content?.length || 0;
    const date = new Date(file.updated_at || file.created_at || Date.now());
    const isDuplicate = file.isDuplicate || false;

    return `
      <div class="table-row file-row ${isDuplicate ? 'duplicate' : ''}" data-file-id="${file.id}" style="
        display: grid;
        grid-template-columns: 40px 2fr 1.5fr 100px 100px 140px;
        gap: 20px;
        align-items: center;
        padding: 14px 20px;
        cursor: pointer;
        ${isDuplicate ? 'background: rgba(245, 158, 11, 0.15);' : ''}
      ">
        <div style="display: flex; align-items: center;">
          <input type="checkbox" class="file-checkbox" data-file-id="${file.id}" style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--primary);">
        </div>
        <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
          <span style="font-size: 18px; flex-shrink: 0;">${icon}</span>
          <div style="min-width: 0; flex: 1;">
            <div style="font-weight: 500; font-size: 14px; color: var(--text); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(file.name)}</div>
            ${isDuplicate ? '<span class="badge badge-warning" style="font-size: 10px; padding: 2px 6px;">Duplicate</span>' : ''}
          </div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${escapeHtml(file.path || '/')}
        </div>
        <div>
          <span class="badge badge-info" style="font-size: 11px;">
            ${ext.toUpperCase() || 'FILE'}
          </span>
        </div>
        <div style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">
          ${formatSize(size)}
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">
          ${formatDate(date)}
        </div>
      </div>
    `;
  }).join('');

  // Add row click handlers
  document.querySelectorAll('.file-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.type !== 'checkbox') {
        const fileId = row.dataset.fileId;
        const file = files.find(f => f.id === fileId);
        if (file) {
          viewFile(file);
        }
      }
    });
    row.addEventListener('mouseenter', function () {
      if (!this.classList.contains('duplicate')) {
        this.style.background = 'var(--bg-hover)';
      }
    });
    row.addEventListener('mouseleave', function () {
      if (!this.classList.contains('duplicate')) {
        this.style.background = 'transparent';
      } else {
        this.style.background = 'rgba(245, 158, 11, 0.15)';
      }
    });
  });
}

function setupEventListeners() {
  // Search
  document.getElementById('file-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFiles();
  });

  // Type filter
  document.getElementById('file-type-filter')?.addEventListener('change', (e) => {
    filterType = e.target.value;
    renderFiles();
  });

  // Sort
  document.getElementById('file-sort')?.addEventListener('change', (e) => {
    const [field, order] = e.target.value.split('-');
    sortBy = field;
    sortOrder = order;
    renderFiles();
  });

  // Refresh
  document.getElementById('refresh-files')?.addEventListener('click', async () => {
    await loadFiles();
    checkDuplicates();
    renderFiles();
  });

  // Cleanup duplicates
  document.getElementById('cleanup-duplicates')?.addEventListener('click', async () => {
    if (confirm('Delete all duplicate files? This cannot be undone.')) {
      await cleanupDuplicates();
    }
  });

  // Bulk actions
  document.getElementById('select-all')?.addEventListener('click', () => {
    document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = true);
    updateBulkActions();
  });

  document.getElementById('clear-selection')?.addEventListener('click', () => {
    document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = false);
    updateBulkActions();
  });

  document.getElementById('delete-selected')?.addEventListener('click', async () => {
    const selected = Array.from(document.querySelectorAll('.file-checkbox:checked'))
      .map(cb => cb.dataset.fileId);
    if (selected.length > 0 && confirm(`Delete ${selected.length} selected files?`)) {
      await deleteFiles(selected);
    }
  });

  // Checkbox changes
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('file-checkbox')) {
      updateBulkActions();
    }
  });
}

function checkDuplicates() {
  const nameMap = new Map();
  files.forEach(file => {
    const key = file.name.toLowerCase();
    if (!nameMap.has(key)) {
      nameMap.set(key, []);
    }
    nameMap.get(key).push(file);
  });

  let duplicateCount = 0;
  nameMap.forEach((fileList, name) => {
    if (fileList.length > 1) {
      // Mark all but the newest as duplicates
      fileList.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0);
        const dateB = new Date(b.updated_at || b.created_at || 0);
        return dateB - dateA; // Newest first
      });
      fileList.slice(1).forEach(file => {
        file.isDuplicate = true;
        duplicateCount++;
      });
    }
  });

  document.getElementById('duplicate-count').textContent = duplicateCount;
  const duplicateChange = document.getElementById('duplicate-change');
  if (duplicateChange) {
    if (duplicateCount > 0) {
      duplicateChange.textContent = 'Needs cleanup';
      duplicateChange.className = 'stat-change negative';
    } else {
      duplicateChange.textContent = 'All clean';
      duplicateChange.className = 'stat-change positive';
    }
  }
  const cleanupBtn = document.getElementById('cleanup-duplicates');
  if (cleanupBtn) {
    cleanupBtn.style.display = duplicateCount > 0 ? 'inline-flex' : 'none';
  }
}

async function cleanupDuplicates() {
  const duplicates = files.filter(f => f.isDuplicate);
  const ids = duplicates.map(f => f.id);
  await deleteFiles(ids);
  await loadFiles();
  checkDuplicates();
  renderFiles();
}

async function deleteFiles(ids) {
  try {
    for (const id of ids) {
      await fetch(`/api/files/${id}`, { method: 'DELETE' });
    }
    await loadFiles();
    checkDuplicates();
    renderFiles();
  } catch (error) {
    console.error('Failed to delete files:', error);
    alert('Failed to delete some files');
  }
}

function viewFile(file) {
  // Open file in a modal or new view
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `;
  modal.innerHTML = `
    <div style="background: var(--bg-card); border-radius: 12px; max-width: 800px; max-height: 80vh; overflow: auto; padding: 24px; width: 100%; border: 1px solid var(--border);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="margin: 0;">${escapeHtml(file.name)}</h2>
        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">�</button>
      </div>
      <pre style="background: var(--bg-secondary); padding: 20px; overflow: auto; font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin: 0; flex: 1; color: var(--text);">${escapeHtml(file.content || 'No content')}</pre>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Close on Escape key
  const closeHandler = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);
}

function updateBulkActions() {
  const selected = document.querySelectorAll('.file-checkbox:checked').length;
  const bulkActions = document.getElementById('bulk-actions');
  const selectedCount = document.getElementById('selected-count');
  const selectedStat = document.getElementById('selected-stat');

  if (selectedStat) {
    selectedStat.textContent = selected;
  }

  if (bulkActions && selectedCount) {
    if (selected > 0) {
      bulkActions.style.display = 'block';
      selectedCount.textContent = `${selected} file${selected !== 1 ? 's' : ''} selected`;
    } else {
      bulkActions.style.display = 'none';
    }
  }
}

function getFileIcon(ext) {
  const icons = {
    'js': '??', 'ts': '??', 'html': '??', 'css': '??',
    'md': '??', 'json': '??', 'txt': '??', 'png': '???',
    'jpg': '???', 'jpeg': '???', 'svg': '???', 'pdf': '??'
  };
  return icons[ext] || '??';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(date) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
