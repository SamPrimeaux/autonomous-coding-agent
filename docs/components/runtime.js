export default function Runtime() {
  return `
    <div style="padding: 24px 16px 80px; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
          App Runtime
        </h1>
        <p style="font-size: 16px; color: var(--text-secondary);">
          Preview and deploy applications
        </p>
      </div>

      <div style="display: flex; gap: 16px; margin-bottom: 16px; align-items: center;">
        <label style="font-size: 14px; font-weight: 600;">Selected App:</label>
        <select id="app-selector" style="
          flex: 1;
          max-width: 300px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
        ">
          <option value="">Loading apps...</option>
        </select>
        <button class="btn btn-primary" id="refresh-btn">Refresh Preview</button>
        <button class="btn btn-secondary" id="deploy-btn">Deploy to Production</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 16px; height: calc(100vh - 300px);">
        <!-- Preview iframe -->
        <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
          <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #10b981;"></div>
            <div style="flex: 1; text-align: center; font-size: 13px; color: var(--text-secondary);">
              Preview
            </div>
          </div>
          <iframe 
            id="preview-iframe" 
            style="
              flex: 1;
              width: 100%;
              border: none;
              background: white;
            "
            src="/runtime/preview"
          ></iframe>
        </div>

        <!-- Log Panel -->
        <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Build & Deploy Log</h3>
          <div 
            id="runtime-log" 
            style="
              flex: 1;
              overflow-y: auto;
              background: #1e293b;
              color: #e2e8f0;
              padding: 12px;
              border-radius: 8px;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.6;
            "
          >
            <div style="color: #64748b;">Ready. Select an app to preview.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function init() {
  // Load apps for selector
  try {
    const response = await fetch('/api/apps');
    const apps = await response.json();
    const selector = document.getElementById('app-selector');

    selector.innerHTML = '<option value="">Select an app...</option>' +
      apps.map(app => `<option value="${app.slug}">${app.name}</option>`).join('');

    // Check URL params for app
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get('app');
    if (appParam) {
      selector.value = appParam;
      loadPreview(appParam);
    }
  } catch (error) {
    console.error('Failed to load apps:', error);
  }

  // App selector change
  document.getElementById('app-selector')?.addEventListener('change', function () {
    const slug = this.value;
    if (slug) {
      loadPreview(slug);
    }
  });

  // Refresh button
  document.getElementById('refresh-btn')?.addEventListener('click', function () {
    const slug = document.getElementById('app-selector').value;
    if (slug) {
      loadPreview(slug);
    }
  });

  // Deploy button
  document.getElementById('deploy-btn')?.addEventListener('click', async function () {
    const slug = document.getElementById('app-selector').value;
    if (!slug) {
      alert('Please select an app first');
      return;
    }

    const log = document.getElementById('runtime-log');
    log.innerHTML += `<div style="color: #f59e0b;">Deploying ${slug}...</div>`;
    log.scrollTop = log.scrollHeight;

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: slug })
      });
      const data = await response.json();

      if (data.status === 'success' || data.status === 'queued') {
        log.innerHTML += `<div style="color: #10b981;">? Deployment ${data.status}</div>`;
        if (data.url) {
          log.innerHTML += `<div style="color: #3b82f6;">URL: ${data.url}</div>`;
        }
      } else {
        log.innerHTML += `<div style="color: #ef4444;">? Deployment failed</div>`;
      }
      log.scrollTop = log.scrollHeight;
    } catch (error) {
      log.innerHTML += `<div style="color: #ef4444;">Error: ${error.message}</div>`;
      log.scrollTop = log.scrollHeight;
    }
  });
}

function loadPreview(slug) {
  const iframe = document.getElementById('preview-iframe');
  iframe.src = `/runtime/preview?appId=${slug}`;
  const log = document.getElementById('runtime-log');
  log.innerHTML += `<div style="color: #64748b;">Loading preview for ${slug}...</div>`;
  log.scrollTop = log.scrollHeight;
}
