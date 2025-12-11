export default function BrowserRendering() {
  return `
    <style>
      .br-wrap { padding: 20px; font-family: 'Inter', sans-serif; color:#0f172a; }
      .br-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:16px; box-shadow:0 10px 30px rgba(15,23,42,0.08); }
      .br-card h3 { margin:0 0 8px; font-size:18px; }
      .br-card p { color:#475569; }
      .br-iframe { margin-top:14px; border:1px solid #e2e8f0; border-radius:12px; width:100%; height:70vh; }
    </style>
    <div class="br-wrap">
      <h2 style="margin:0 0 8px;">Browser Rendering</h2>
      <p style="margin:0 0 12px; color:#475569;">Preview public pages or APIs. Enter any URL below.</p>
      <div class="br-card">
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <input id="br-url" style="flex:1; padding:10px; border-radius:10px; border:1px solid #e2e8f0;" placeholder="https://meaux-options.meauxbility.workers.dev/" value="https://meaux-options.meauxbility.workers.dev/">
          <button id="br-load" style="padding:10px 12px; border-radius:10px; border:1px solid #0ea5e9; background:#0ea5e9; color:white; font-weight:600;">Load</button>
        </div>
        <iframe id="br-frame" class="br-iframe" src="https://meaux-options.meauxbility.workers.dev/"></iframe>
      </div>
    </div>
  `;
}

export function init() {
  const loadBtn = document.getElementById('br-load');
  const urlInput = document.getElementById('br-url');
  const frame = document.getElementById('br-frame');
  if (loadBtn && urlInput && frame) {
    loadBtn.addEventListener('click', () => {
      let url = urlInput.value.trim();
      if (!url.startsWith('http')) url = 'https://' + url;
      frame.src = url;
    });
  }
}
// Browser Rendering Component for MeauxOS
export default function BrowserRendering() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">
        <span style="display: inline-block; font-size: 3rem; margin-right: 16px; animation: float 3s ease-in-out infinite;">🖥️</span>
        Browser Rendering
      </h1>
      <p class="page-subtitle">Run a full Chromium browser at the edge • Puppeteer & Playwright support</p>
    </div>
    <div style="padding: 0; max-width: 1600px; margin: 0 auto;">
      <!-- Stats -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div style="background: var(--bg-elevated); border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">28.4K</div>
            <div style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Renders This Month</div>
          </div>
          <div style="background: var(--bg-elevated); border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">1.2s</div>
            <div style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Avg Render Time</div>
          </div>
          <div style="background: var(--bg-elevated); border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">$89</div>
            <div style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Monthly Cost</div>
          </div>
          <div style="background: var(--bg-elevated); border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">90%</div>
            <div style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">vs AWS Savings</div>
          </div>
        </div>
      </div>

      <!-- Quick Deploy / AutoRAG Preview -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 24px;">Quick Preview / AutoRAG</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px;">HTML Code</label>
            <textarea id="autoragCode" style="width: 100%; min-height: 120px; padding: 12px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; resize: vertical;" placeholder="<html>...</html>"></textarea>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px;">Or URL</label>
            <input type="text" id="autoragUrl" style="width: 100%; padding: 12px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 0.875rem; margin-bottom: 12px;" placeholder="https://example.com">
            <button id="autoragPreviewBtn" class="btn btn-primary" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
              Generate Preview
            </button>
          </div>
        </div>
        <div id="autoragResult" style="display: none; margin-top: 16px; padding: 16px; background: var(--bg-elevated); border-radius: 8px; border: 1px solid var(--border);">
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 8px;">Preview URL:</div>
          <a id="autoragPreviewLink" href="#" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600; word-break: break-all;">Loading...</a>
        </div>
      </div>

      <!-- API Endpoints -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 24px;">Available Endpoints</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          ${[
      { icon: '📸', name: '/screenshot', desc: 'Capture full-page or viewport screenshots in PNG, JPEG, or WebP' },
      { icon: '📄', name: '/pdf', desc: 'Render any webpage as a PDF with custom options' },
      { icon: '🔍', name: '/scrape', desc: 'Extract structured data using CSS selectors' },
      { icon: '🧠', name: '/json', desc: 'AI-powered data extraction to JSON schema' },
      { icon: '📝', name: '/markdown', desc: 'Convert any webpage to clean Markdown' },
      { icon: '🔗', name: '/links', desc: 'Extract all links from a webpage' },
      { icon: '📦', name: '/content', desc: 'Fetch fully-rendered HTML after JS execution' },
      { icon: '📷', name: '/snapshot', desc: 'Take a complete webpage snapshot' }
    ].map(endpoint => `
            <div class="api-card" style="background: var(--bg-elevated); border: 2px solid var(--border); border-radius: 12px; padding: 24px; transition: all 0.3s ease; cursor: pointer; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent)); transform: scaleX(0); transition: transform 0.3s ease;"></div>
              <div style="font-size: 2.5rem; margin-bottom: 16px;">${endpoint.icon}</div>
              <div style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">${endpoint.name}</div>
              <div style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">${endpoint.desc}</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--accent); background: var(--bg-secondary); padding: 8px; border-radius: 6px;">POST ${endpoint.name}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Use Cases -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 24px;">Live Demo Examples</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
          ${[
      { icon: '📊', title: 'Social Media Previews', desc: 'Automatically generate Open Graph images for blog posts and pages', meta: ['⚡ 892ms avg', '📸 12.4K/mo'] },
      { icon: '🧾', title: 'Invoice Generation', desc: 'Convert HTML invoices to PDF for email delivery', meta: ['⚡ 1.1s avg', '📄 3.2K/mo'] },
      { icon: '🔍', title: 'Competitive Intelligence', desc: 'Monitor competitor pricing and product changes', meta: ['⚡ 2.3s avg', '🔄 Daily cron'] },
      { icon: '📰', title: 'Content Aggregation', desc: 'Scrape articles and convert to markdown for your CMS', meta: ['⚡ 1.8s avg', '📝 8.7K/mo'] },
      { icon: '🧪', title: 'E2E Testing', desc: 'Automated Playwright tests on every deployment', meta: ['⚡ 3.4s avg', '🧪 450/mo'] },
      { icon: '📱', title: 'Mobile Preview', desc: 'Generate mobile screenshots for app store listings', meta: ['⚡ 1.5s avg', '📱 2.1K/mo'] }
    ].map(demo => `
            <div class="demo-card" style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: all 0.3s ease; cursor: pointer;">
              <div style="width: 100%; height: 200px; background: linear-gradient(135deg, var(--bg-secondary), var(--bg-hover)); display: flex; align-items: center; justify-content: center; font-size: 4rem; position: relative; overflow: hidden;">
                <div style="position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(31, 151, 169, 0.1));"></div>
                ${demo.icon}
              </div>
              <div style="padding: 24px;">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 8px; font-size: 1.125rem;">${demo.title}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6;">${demo.desc}</div>
                <div style="display: flex; gap: 16px; font-size: 0.8125rem; color: var(--text-muted);">
                  ${demo.meta.map(m => `<span>${m}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Code Examples -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 24px;">Integration Examples</h2>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 24px; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; overflow-x: auto;">
          <div style="color: var(--accent); margin-bottom: 16px; font-weight: 600;">// REST API Example</div>
          <div style="color: var(--text-primary); margin-bottom: 8px;">const response = await fetch('https://api.cloudflare.com/browser/screenshot', {</div>
          <div style="color: var(--text-primary); margin-left: 20px; margin-bottom: 8px;">method: 'POST',</div>
          <div style="color: var(--text-primary); margin-left: 20px; margin-bottom: 8px;">headers: { 'Authorization': \`Bearer \${token}\` },</div>
          <div style="color: var(--text-primary); margin-left: 20px; margin-bottom: 8px;">body: JSON.stringify({ url: 'https://example.com', fullPage: true })</div>
          <div style="color: var(--text-primary); margin-bottom: 16px;">});</div>
          <div style="color: var(--text-muted); margin-bottom: 8px;">// Returns PNG buffer</div>
        </div>
      </div>
    </div>
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .api-card:hover {
        transform: translateY(-4px);
        border-color: var(--primary);
        box-shadow: var(--shadow-md);
      }
      .api-card:hover > div:first-child {
        transform: scaleX(1);
      }
      .demo-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        border-color: var(--primary);
      }
    </style>
  `;
}

export function init() {
  console.log('Browser Rendering init');

  // Add hover effects
  document.querySelectorAll('.api-card, .demo-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  // AutoRAG Preview Handler
  const autoragBtn = document.getElementById('autoragPreviewBtn');
  const autoragCode = document.getElementById('autoragCode');
  const autoragUrl = document.getElementById('autoragUrl');
  const autoragResult = document.getElementById('autoragResult');
  const autoragPreviewLink = document.getElementById('autoragPreviewLink');

  if (autoragBtn) {
    autoragBtn.addEventListener('click', async () => {
      const code = autoragCode?.value.trim();
      const url = autoragUrl?.value.trim();

      if (!code && !url) {
        alert('Please provide either HTML code or a URL');
        return;
      }

      autoragBtn.disabled = true;
      autoragBtn.textContent = 'Generating...';

      try {
        const response = await fetch('/api/autorag/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, url, type: 'html' })
        });

        const data = await response.json();

        if (data.previewUrl) {
          autoragPreviewLink.href = data.previewUrl;
          autoragPreviewLink.textContent = data.previewUrl;
          autoragResult.style.display = 'block';
        } else {
          alert('Failed to generate preview: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error generating preview:', error);
        alert('Failed to generate preview. Check console for details.');
      } finally {
        autoragBtn.disabled = false;
        autoragBtn.textContent = 'Generate Preview';
      }
    });
  }
}
