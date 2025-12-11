// Smart Upload Component - Auto-detect, optimize, and deploy
export default function SmartUpload() {
  return `
    <div class="smart-upload">
      <div class="upload-header">
        <h2>Smart Upload & Auto-Deploy</h2>
        <p>Drop any file (zip, tar, MD, HTML, SVG, PNG, GLB, videos) and we'll analyze, optimize, and deploy it automatically</p>
      </div>

      <!-- Upload Zone -->
      <div class="upload-zone" id="upload-zone">
        <div class="upload-content">
          <div class="upload-icon">??</div>
          <h3>Drop files here or click to upload</h3>
          <p>Supports: ZIP, TAR, MD, HTML, SVG, PNG, GLB, MP4, and more</p>
          <input type="file" id="file-input" multiple accept=".zip,.tar,.gz,.md,.html,.svg,.png,.jpg,.jpeg,.glb,.gltf,.mp4,.webm,.mov" style="display: none;">
          <button class="btn-primary" onclick="document.getElementById('file-input').click()">Choose Files</button>
        </div>
      </div>

      <!-- Metadata Editor -->
      <div class="metadata-editor" id="metadata-editor" style="display: none;">
        <h3>Edit Metadata</h3>
        <form id="metadata-form">
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" id="meta-title">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" id="meta-description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Tags (comma-separated)</label>
            <input type="text" name="tags" id="meta-tags" placeholder="react, nextjs, production">
          </div>
          <div class="form-group">
            <label>Custom Metadata (JSON)</label>
            <textarea name="custom" id="meta-custom" rows="4" placeholder='{"author": "Your Name", "version": "1.0.0"}'></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="closeMetadataEditor()">Cancel</button>
            <button type="submit" class="btn-primary">Save Metadata</button>
          </div>
        </form>
      </div>

      <!-- Upload Progress -->
      <div class="upload-progress" id="upload-progress" style="display: none;">
        <h3>Processing Files</h3>
        <div class="progress-list" id="progress-list"></div>
      </div>

      <!-- Analysis Results -->
      <div class="analysis-results" id="analysis-results" style="display: none;">
        <h3>Analysis Results</h3>
        <div class="analysis-content" id="analysis-content"></div>
        <div class="analysis-actions">
          <button class="btn-secondary" id="edit-metadata-btn">Edit Metadata</button>
          <button class="btn-primary" id="deploy-btn" style="display: none;">Deploy Now</button>
        </div>
      </div>

      <!-- Projects List -->
      <div class="projects-list">
        <h3>Uploaded Projects</h3>
        <div id="projects-container">
          <div class="loading">Loading projects...</div>
        </div>
      </div>
    </div>
  `;
}

let currentProjectId = null;

export function init() {
  initUploadZone();
  loadProjects();
}

function initUploadZone() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  });

  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  });
}

async function processFiles(files) {
  const progressDiv = document.getElementById('upload-progress');
  const progressList = document.getElementById('progress-list');
  progressDiv.style.display = 'block';
  progressList.innerHTML = '';

  for (const file of files) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-name">${file.name}</div>
      <div class="file-size">${formatBytes(file.size)}</div>
      <div class="file-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        <span class="progress-text">0%</span>
      </div>
    `;
    progressList.appendChild(fileItem);

    await uploadFile(file, fileItem);
  }
}

async function uploadFile(file, fileItem) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('autoDeploy', 'true');
  formData.append('metadata', JSON.stringify({
    originalName: file.name,
    uploadedAt: new Date().toISOString(),
  }));

  const progressFill = fileItem.querySelector('.progress-fill');
  const progressText = fileItem.querySelector('.progress-text');

  try {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        progressFill.style.width = percent + '%';
        progressText.textContent = Math.round(percent) + '%';
      }
    });

    xhr.addEventListener('load', async () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        fileItem.classList.add('complete');
        progressFill.style.width = '100%';
        progressText.textContent = 'Complete!';

        // Show analysis results
        showAnalysisResults(result);
      } else {
        fileItem.classList.add('error');
        progressText.textContent = 'Error: ' + xhr.statusText;
      }
    });

    xhr.open('POST', '/api/upload/smart');
    xhr.send(formData);
  } catch (error) {
    fileItem.classList.add('error');
    progressText.textContent = 'Error: ' + error.message;
  }
}

function showAnalysisResults(result) {
  const resultsDiv = document.getElementById('analysis-results');
  const contentDiv = document.getElementById('analysis-content');
  currentProjectId = result.projectId;

  contentDiv.innerHTML = `
    <div class="analysis-card">
      <h4>Project Analysis</h4>
      <div class="analysis-grid">
        <div class="analysis-item">
          <label>Type:</label>
          <span>${result.analysis.type}</span>
        </div>
        <div class="analysis-item">
          <label>Completion:</label>
          <span>${result.analysis.completion}%</span>
        </div>
        <div class="analysis-item">
          <label>Size:</label>
          <span>${formatBytes(result.analysis.size)}</span>
        </div>
        <div class="analysis-item">
          <label>Files:</label>
          <span>${result.analysis.files.length}</span>
        </div>
        <div class="analysis-item">
          <label>Needs Build:</label>
          <span>${result.analysis.needsBuild ? 'Yes' : 'No'}</span>
        </div>
        <div class="analysis-item">
          <label>Deployment Ready:</label>
          <span class="${result.analysis.deploymentReady ? 'ready' : 'not-ready'}">
            ${result.analysis.deploymentReady ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>

    ${result.optimized && result.optimized.length > 0 ? `
      <div class="optimized-assets">
        <h4>Optimized Assets</h4>
        <ul>
          ${result.optimized.map(opt => `
            <li>
              <a href="${opt.url}" target="_blank">${opt.original}</a>
              <span class="optimized-badge">Optimized</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    ${result.deployment ? `
      <div class="deployment-status">
        <h4>Deployment</h4>
        ${result.deployment.success ? `
          <p class="success">? Deployed successfully!</p>
          <p><a href="${result.deployment.url}" target="_blank">${result.deployment.url}</a></p>
        ` : `
          <p class="error">? Deployment failed: ${result.deployment.error}</p>
        `}
      </div>
    ` : ''}
  `;

  resultsDiv.style.display = 'block';

  // Show deploy button if ready
  if (result.analysis.deploymentReady) {
    document.getElementById('deploy-btn').style.display = 'block';
    document.getElementById('deploy-btn').onclick = () => deployProject(result.projectId);
  }
}

async function loadProjects() {
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    const container = document.getElementById('projects-container');

    if (data.projects && data.projects.length > 0) {
      container.innerHTML = data.projects.map(project => `
        <div class="project-card">
          <div class="project-header">
            <h4>${project.name}</h4>
            <span class="status-badge ${project.status}">${project.status}</span>
          </div>
          <div class="project-details">
            <div class="detail-item">
              <label>Type:</label>
              <span>${project.type || 'unknown'}</span>
            </div>
            <div class="detail-item">
              <label>Completion:</label>
              <span>${project.metadata?.completion || 0}%</span>
            </div>
            <div class="detail-item">
              <label>Updated:</label>
              <span>${new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="project-actions">
            <button class="btn-sm" onclick="editProjectMetadata('${project.id}')">Edit Metadata</button>
            ${project.status === 'ready' ? `
              <button class="btn-sm btn-primary" onclick="deployProject('${project.id}')">Deploy</button>
            ` : ''}
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<div class="empty-state">No projects uploaded yet</div>';
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

async function editProjectMetadata(projectId) {
  currentProjectId = projectId;
  const editor = document.getElementById('metadata-editor');
  editor.style.display = 'block';

  // Load existing metadata
  try {
    const res = await fetch(`/api/projects`);
    const data = await res.json();
    const project = data.projects.find(p => p.id === projectId);

    if (project && project.metadata) {
      document.getElementById('meta-title').value = project.metadata.title || project.name;
      document.getElementById('meta-description').value = project.metadata.description || '';
      document.getElementById('meta-tags').value = (project.metadata.tags || []).join(', ');
      document.getElementById('meta-custom').value = JSON.stringify(project.metadata.custom || {}, null, 2);
    }
  } catch (error) {
    console.error('Error loading metadata:', error);
  }
}

function closeMetadataEditor() {
  document.getElementById('metadata-editor').style.display = 'none';
}

document.getElementById('metadata-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentProjectId) return;

  const metadata = {
    title: document.getElementById('meta-title').value,
    description: document.getElementById('meta-description').value,
    tags: document.getElementById('meta-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    custom: JSON.parse(document.getElementById('meta-custom').value || '{}'),
  };

  try {
    const res = await fetch(`/api/projects/${currentProjectId}/metadata`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata }),
    });

    if (res.ok) {
      alert('Metadata updated!');
      closeMetadataEditor();
      loadProjects();
    }
  } catch (error) {
    alert('Error updating metadata: ' + error.message);
  }
});

async function deployProject(projectId) {
  try {
    const res = await fetch(`/api/projects/${projectId}/deploy`, {
      method: 'POST',
    });

    const result = await res.json();
    if (result.success) {
      alert('Deployment started!');
      loadProjects();
    } else {
      alert('Deployment failed: ' + result.error);
    }
  } catch (error) {
    alert('Error deploying: ' + error.message);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
