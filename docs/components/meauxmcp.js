// MeauxMCP Component - 3D GLB Asset Viewer
export default function MeauxMCP() {
    const currentPath = window.location.pathname;

    return `
    <div class="landing-page">
      <header class="landing-header">
        <a href="/" class="logo">
          <div class="logo-icon">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
          </div>
          <span style="font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.02em;">Inner Animal Media</span>
        </a>
        <nav class="landing-nav">
          <a href="/" class="landing-nav-item" data-route="/">Home</a>
          <a href="/services" class="landing-nav-item" data-route="/services">Services</a>
          <a href="/work" class="landing-nav-item" data-route="/work">Work</a>
          <a href="/meauxmcp" class="landing-nav-item active" data-route="/meauxmcp">MeauxMCP</a>
          <button class="landing-btn" onclick="window.router.navigate('/login')">Dashboard</button>
        </nav>
      </header>

      <section style="padding: 160px 40px 100px; max-width: 1400px; margin: 0 auto; min-height: 100vh;">
        <div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px; height: 700px;">
          <!-- 3D Viewer Area -->
          <div class="card" style="padding: 0; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000;">
            <div id="glb-viewer-container" style="width: 100%; height: 100%;">
              <div style="color: var(--muted); text-align: center; padding-top: 300px;">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-bottom: 20px; opacity: 0.5;">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
                </svg>
                <div style="font-size: 14px; font-weight: 600;">Initialize 3D Rendering Engine...</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.5;">Model-Viewer / Three.js Bridge Active</div>
              </div>
            </div>
            
            <!-- Viewer Controls -->
            <div style="position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px;">
              <button class="btn btn-secondary" style="background: rgba(10,16,34,0.8); border-radius: 100px; padding: 10px 20px;">Rotate</button>
              <button class="btn btn-secondary" style="background: rgba(10,16,34,0.8); border-radius: 100px; padding: 10px 20px;">Zoom</button>
              <button class="btn btn-secondary" style="background: rgba(10,16,34,0.8); border-radius: 100px; padding: 10px 20px;">Explode</button>
            </div>
          </div>

          <!-- Assets List -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card" style="flex: 1; display: flex; flex-direction: column;">
              <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 20px; display: flex; justify-content: space-between;">
                GLB Assets
                <span style="font-size: 10px; color: var(--cyan);">R2 SYNCED</span>
              </h3>
              <div id="mcp-asset-list" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
                <div class="asset-item active" style="padding: 16px; background: var(--nav-active); border: 1px solid var(--cyan); border-radius: 12px; cursor: pointer;">
                  <div style="font-weight: 700; color: #fff; font-size: 14px;">meaux_node_v4.glb</div>
                  <div style="font-size: 11px; color: var(--muted2); margin-top: 4px;">4.2 MB • Updated 2h ago</div>
                </div>
                <div class="asset-item" style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--stroke); border-radius: 12px; cursor: pointer;">
                  <div style="font-weight: 700; color: #fff; font-size: 14px;">server_rack_isometric.glb</div>
                  <div style="font-size: 11px; color: var(--muted2); margin-top: 4px;">12.8 MB • Updated 1d ago</div>
                </div>
                <div class="asset-item" style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--stroke); border-radius: 12px; cursor: pointer;">
                  <div style="font-weight: 700; color: #fff; font-size: 14px;">intelligent_agent_drone.glb</div>
                  <div style="font-size: 11px; color: var(--muted2); margin-top: 4px;">8.1 MB • Updated 3d ago</div>
                </div>
              </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; padding: 20px;">Upload New Asset</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function init() {
    document.querySelectorAll('.landing-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = item.getAttribute('data-route');
            if (route) window.router.navigate(route);
        });
    });

    // Load Model Viewer script if not present
    if (!document.querySelector('script[src*="model-viewer"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            renderModel('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
        };
    } else {
        renderModel('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
    }

    function renderModel(src) {
        const container = document.getElementById('glb-viewer-container');
        if (!container) return;

        container.innerHTML = `
      <model-viewer 
        src="${src}" 
        alt="A 3D model of a MeauxNode" 
        auto-rotate 
        camera-controls 
        style="width: 100%; height: 100%; background: transparent;"
        shadow-intensity="2"
        environment-image="neutral"
        exposure="1"
      ></model-viewer>
    `;
    }
}

