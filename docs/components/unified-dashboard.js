// Unified Dashboard Component - MeauxOptions OS
// Seamless UI/UX for all features

export default function UnifiedDashboard() {
  return `
    <div class="unified-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>MeauxOptions OS Dashboard</h1>
        <div class="header-actions">
          <button class="btn-primary" id="quick-deploy-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Quick Deploy
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">??</div>
          <div class="stat-content">
            <div class="stat-value" id="tunnels-count">0</div>
            <div class="stat-label">Active Tunnels</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">??</div>
          <div class="stat-content">
            <div class="stat-value" id="buckets-count">0</div>
            <div class="stat-label">R2 Buckets</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">??</div>
          <div class="stat-content">
            <div class="stat-value" id="documents-count">0</div>
            <div class="stat-label">Knowledge Docs</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">?</div>
          <div class="stat-content">
            <div class="stat-value" id="deployments-count">0</div>
            <div class="stat-label">Deployments</div>
          </div>
        </div>
      </div>

      <!-- Main Tabs -->
      <div class="dashboard-tabs">
        <button class="tab-btn active" data-tab="tunnels">Tunnels</button>
        <button class="tab-btn" data-tab="r2">R2 Storage</button>
        <button class="tab-btn" data-tab="deployments">Deployments</button>
        <button class="tab-btn" data-tab="autorag">AutoRAG</button>
        <button class="tab-btn" data-tab="workflows">Workflows</button>
      </div>

      <!-- Tunnels Tab -->
      <div class="tab-content active" id="tunnels-tab">
        <div class="section-header">
          <h2>Cloudflare Tunnels</h2>
          <button class="btn-primary" id="create-tunnel-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Tunnel
          </button>
        </div>
        <div class="tunnels-list" id="tunnels-list">
          <div class="loading">Loading tunnels...</div>
        </div>
      </div>

      <!-- R2 Storage Tab -->
      <div class="tab-content" id="r2-tab">
        <div class="section-header">
          <h2>R2 Storage</h2>
          <div class="header-actions">
            <select id="bucket-select" class="select-input">
              <option>Loading buckets...</option>
            </select>
            <button class="btn-secondary" id="upload-file-btn">Upload</button>
          </div>
        </div>
        <div class="r2-browser" id="r2-browser">
          <div class="loading">Select a bucket to browse...</div>
        </div>
      </div>

      <!-- Deployments Tab -->
      <div class="tab-content" id="deployments-tab">
        <div class="section-header">
          <h2>Deployments</h2>
          <button class="btn-primary" id="new-deployment-btn">New Deployment</button>
        </div>
        <div class="deployments-list" id="deployments-list">
          <div class="loading">Loading deployments...</div>
        </div>
      </div>

      <!-- AutoRAG Tab -->
      <div class="tab-content" id="autorag-tab">
        <div class="section-header">
          <h2>AutoRAG Knowledge Base</h2>
          <button class="btn-primary" id="ingest-doc-btn">Ingest Document</button>
        </div>
        <div class="autorag-content">
          <div class="autorag-stats">
            <div class="stat-item">
              <span class="stat-label">Documents:</span>
              <span class="stat-value" id="autorag-docs">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Chunks:</span>
              <span class="stat-value" id="autorag-chunks">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Queries:</span>
              <span class="stat-value" id="autorag-queries">0</span>
            </div>
          </div>
          <div class="documents-list" id="autorag-documents">
            <div class="loading">Loading documents...</div>
          </div>
        </div>
      </div>

      <!-- Workflows Tab -->
      <div class="tab-content" id="workflows-tab">
        <div class="section-header">
          <h2>Workflow Automation</h2>
          <button class="btn-primary" id="create-workflow-btn">Create Workflow</button>
        </div>
        <div class="workflows-list" id="workflows-list">
          <div class="empty-state">
            <div class="empty-icon">??</div>
            <h3>No workflows yet</h3>
            <p>Create your first workflow to automate tasks</p>
            <button class="btn-primary" id="create-first-workflow-btn">Create Workflow</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div class="modal" id="create-tunnel-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create Cloudflare Tunnel</h2>
          <button class="modal-close" data-modal="create-tunnel-modal">&times;</button>
        </div>
        <form id="create-tunnel-form">
          <div class="form-group">
            <label>Tunnel Name</label>
            <input type="text" name="tunnel_name" required placeholder="my-web-shell">
          </div>
          <div class="form-group">
            <label>Hostname</label>
            <input type="text" name="hostname" required placeholder="shell.meauxbility.com">
          </div>
          <div class="form-group">
            <label>Local Service URL</label>
            <input type="url" name="local_service" required placeholder="http://localhost:8080">
          </div>
          <div class="form-group">
            <label>Allowed Emails (comma-separated)</label>
            <input type="text" name="allowed_emails" placeholder="user@example.com,admin@example.com">
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" data-modal="create-tunnel-modal">Cancel</button>
            <button type="submit" class="btn-primary">Create Tunnel</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Dashboard JavaScript Logic
export function initDashboard() {
  // Load initial data
  loadDashboardStats();
  loadTunnels();
  loadBuckets();
  loadDeployments();
  loadAutoRAG();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Create tunnel
  document.getElementById('create-tunnel-btn')?.addEventListener('click', () => {
    document.getElementById('create-tunnel-modal')?.classList.add('active');
  });

  document.getElementById('create-tunnel-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.allowed_emails) {
      data.allowed_emails = data.allowed_emails.split(',').map(e => e.trim()).filter(Boolean);
    }

    try {
      const res = await fetch('/api/cloudflare/tunnels/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert('Tunnel created successfully!');
        document.getElementById('create-tunnel-modal')?.classList.remove('active');
        loadTunnels();
        loadDashboardStats();
      } else {
        alert('Error: ' + (result.error || 'Failed to create tunnel'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

async function loadDashboardStats() {
  try {
    const [tunnels, buckets, documents] = await Promise.all([
      fetch('/api/cloudflare/tunnels').then(r => r.json()),
      fetch('/api/r2/buckets').then(r => r.json()),
      fetch('/api/autorag/documents').then(r => r.json())
    ]);

    document.getElementById('tunnels-count').textContent = tunnels.total || 0;
    document.getElementById('buckets-count').textContent = buckets.total || 0;
    document.getElementById('documents-count').textContent = documents.length || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadTunnels() {
  try {
    const res = await fetch('/api/cloudflare/tunnels');
    const data = await res.json();
    const list = document.getElementById('tunnels-list');

    if (data.tunnels && data.tunnels.length > 0) {
      list.innerHTML = data.tunnels.map(tunnel => `
        <div class="tunnel-card">
          <div class="tunnel-header">
            <h3>${tunnel.name}</h3>
            <span class="status-badge ${tunnel.status || 'active'}">${tunnel.status || 'Active'}</span>
          </div>
          <div class="tunnel-details">
            <div class="detail-item">
              <span class="label">ID:</span>
              <span class="value">${tunnel.id}</span>
            </div>
            <div class="detail-item">
              <span class="label">Created:</span>
              <span class="value">${new Date(tunnel.created_at * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="tunnel-actions">
            <button class="btn-sm btn-secondary" onclick="downloadCredentials('${tunnel.id}')">Download Credentials</button>
            <button class="btn-sm btn-danger" onclick="deleteTunnel('${tunnel.id}')">Delete</button>
          </div>
        </div>
      `).join('');
    } else {
      list.innerHTML = '<div class="empty-state">No tunnels yet. Create your first tunnel!</div>';
    }
  } catch (error) {
    console.error('Error loading tunnels:', error);
    document.getElementById('tunnels-list').innerHTML = '<div class="error">Error loading tunnels</div>';
  }
}

async function loadBuckets() {
  try {
    const res = await fetch('/api/r2/buckets');
    const data = await res.json();
    const select = document.getElementById('bucket-select');

    if (data.buckets && data.buckets.length > 0) {
      select.innerHTML = '<option value="">Select a bucket...</option>' +
        data.buckets.map(b => `<option value="${b.name}">${b.name}</option>`).join('');

      select.addEventListener('change', (e) => {
        if (e.target.value) {
          loadBucketObjects(e.target.value);
        }
      });
    }
  } catch (error) {
    console.error('Error loading buckets:', error);
  }
}

async function loadBucketObjects(bucket) {
  try {
    const res = await fetch(`/api/r2/buckets/${bucket}/objects`);
    const data = await res.json();
    const browser = document.getElementById('r2-browser');

    if (data.objects && data.objects.length > 0) {
      browser.innerHTML = `
        <div class="file-grid">
          ${data.objects.map(obj => `
            <div class="file-item">
              <div class="file-icon">??</div>
              <div class="file-name">${obj.key}</div>
              <div class="file-size">${formatBytes(obj.size)}</div>
              <div class="file-actions">
                <button class="btn-sm" onclick="downloadFile('${bucket}', '${obj.key}')">Download</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      browser.innerHTML = '<div class="empty-state">Bucket is empty</div>';
    }
  } catch (error) {
    console.error('Error loading objects:', error);
  }
}

async function loadDeployments() {
  // TODO: Implement
  document.getElementById('deployments-list').innerHTML = '<div class="empty-state">No deployments yet</div>';
}

async function loadAutoRAG() {
  try {
    const res = await fetch('/api/autorag/documents');
    const data = await res.json();

    document.getElementById('autorag-docs').textContent = data.length || 0;
    document.getElementById('autorag-chunks').textContent =
      data.reduce((sum, doc) => sum + (doc.chunk_count || 0), 0);

    const list = document.getElementById('autorag-documents');
    if (data.length > 0) {
      list.innerHTML = data.map(doc => `
        <div class="document-card">
          <h4>${doc.title}</h4>
          <div class="doc-meta">
            <span>${doc.chunk_count || 0} chunks</span>
            <span>${doc.category || 'uncategorized'}</span>
            <span>${new Date(doc.created_at * 1000).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');
    } else {
      list.innerHTML = '<div class="empty-state">No documents ingested yet</div>';
    }
  } catch (error) {
    console.error('Error loading AutoRAG:', error);
  }
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
  document.getElementById(`${tab}-tab`)?.classList.add('active');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
