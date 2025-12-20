// Refined Smart Upload Component
export default function SmartUpload() {
  return `
    <style>
      .upload-container {
        padding: 3rem;
        max-width: 1000px;
        margin: 0 auto;
        animation: fadeIn 0.5s ease;
      }

      .upload-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .upload-header h1 {
        font-size: 2.5rem;
        font-weight: 800;
        color: #fff;
        margin-bottom: 1rem;
      }

      .drop-zone {
        background: var(--bg-secondary);
        border: 2px dashed var(--border-color);
        border-radius: 32px;
        padding: 5rem 2rem;
        text-align: center;
        transition: var(--transition);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      .drop-zone:hover {
        border-color: var(--meaux-cyan);
        background: rgba(0, 212, 255, 0.05);
        transform: scale(1.01);
      }

      .upload-icon-ring {
        width: 80px;
        height: 80px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--meaux-cyan);
        margin-bottom: 1rem;
      }

      .progress-container {
        margin-top: 3rem;
        display: none;
      }

      .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 4rem;
      }

      .project-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 1.5rem;
        transition: var(--transition);
      }

      .project-card:hover {
        border-color: var(--meaux-cyan);
      }
    </style>

    <div class="upload-container">
      <div class="upload-header">
        <h1>Ingest Assets</h1>
        <p style="color: var(--text-muted);">Intelligent analysis, optimization, and edge deployment pipeline.</p>
      </div>

      <div class="drop-zone" id="drop-zone">
        <div class="upload-icon-ring">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div>
          <h3 style="color: #fff; margin-bottom: 0.5rem;">Drop project archive here</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Supports ZIP, TAR, MD, and 3D Assets (GLB)</p>
        </div>
        <input type="file" id="file-input" style="display: none;" multiple>
        <button class="btn btn-primary" onclick="document.getElementById('file-input').click()">
          Select Files
        </button>
      </div>

      <div id="upload-progress" class="progress-container">
        <h3 style="color: #fff; margin-bottom: 1.5rem;">Orchestrating Deployment...</h3>
        <div id="progress-list" style="display: flex; flex-direction: column; gap: 1rem;"></div>
      </div>

      <div style="margin-top: 5rem;">
        <h2 style="color: #fff; margin-bottom: 2rem;">Cluster Projects</h2>
        <div id="projects-container" class="project-grid">
          <div class="loading">Querying D1 cluster...</div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  dropZone?.addEventListener('click', () => fileInput?.click());

  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--meaux-cyan)';
  });

  dropZone?.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--border-color)';
  });

  dropZone?.addEventListener('drop', async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await processUploads(files);
  });

  fileInput?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    await processUploads(files);
  });

  loadProjects();
}

async function processUploads(files) {
  const progress = document.getElementById('upload-progress');
  const list = document.getElementById('progress-list');
  if (progress) progress.style.display = 'block';

  for (const file of files) {
    const item = document.createElement('div');
    item.className = 'card';
    item.style.padding = '1rem';
    item.innerHTML = \`
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 600; color: #fff;">\${file.name}</div>
        <div id="status-\${file.name}" style="font-size: 0.8rem; color: var(--meaux-cyan);">Syncing...</div>
      </div>
    \`;
    list?.appendChild(item);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('autoDeploy', 'true');

    try {
      const res = await fetch('/api/upload/smart', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      const statusEl = document.getElementById(\`status-\${file.name}\`);
      if (statusEl) {
        statusEl.innerHTML = 'Cluster Deployed';
        statusEl.style.color = '#10b981';
      }
      loadProjects();
    } catch (e) {
      const statusEl = document.getElementById(\`status-\${file.name}\`);
      if (statusEl) statusEl.innerHTML = 'Sync Error';
    }
  }
}

async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    const projects = data.projects || [];

    if (projects.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted);">No projects in this cluster.</div>';
      return;
    }

    container.innerHTML = projects.map(p => `
      < div class="project-card" >
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
          <div style="font-weight: 700; color: #fff;">${p.name}</div>
          <div class="status-badge" style="font-size: 0.7rem;">Active</div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          ${p.description || 'Module synchronized with edge infrastructure.'}
        </p>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-sm" style="flex: 1;" onclick="window.open('https://autonomous-coding-agent.meauxbility.workers.dev/preview/${p.id}/index.html', '_blank')">Preview</button>
          <button class="btn-sm">Logs</button>
        </div>
      </div >
      `).join('');
  } catch (e) {
    container.innerHTML = 'Error loading cluster.';
  }
}
