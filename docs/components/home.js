// Refined Home Component - Interactive 3D Hero & Real Cluster Modules
export default function Home() {
  return `
    <style>
      .hero-scene {
        position: relative;
        padding: 80px 32px;
        background: linear-gradient(135deg, rgba(15, 20, 25, 0.95) 0%, rgba(26, 35, 50, 0.9) 100%);
        overflow: hidden;
        border-bottom: 1px solid var(--stroke);
      }

      /* Animated Background Orbs */
      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        z-index: 0;
        opacity: 0.3;
      }

      .blob-1 {
        top: 20%; left: 10%; width: 300px; height: 300px;
        background: radial-gradient(circle, var(--cyan), transparent);
        animation: float 8s ease-in-out infinite;
      }

      .blob-2 {
        bottom: 20%; right: 10%; width: 400px; height: 400px;
        background: radial-gradient(circle, var(--blue), transparent);
        animation: float 10s ease-in-out infinite reverse;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.1); }
      }

      .hero-content {
        position: relative;
        z-index: 1;
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: center;
      }

      @media (max-width: 1024px) {
        .hero-content { grid-template-columns: 1fr; text-align: center; }
        .hero-3d { display: none; }
      }

      .hero-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(34, 211, 238, 0.15);
        border: 1px solid rgba(34, 211, 238, 0.3);
        border-radius: 100px;
        width: fit-content;
        margin-bottom: 24px;
      }

      @media (max-width: 1024px) { .hero-tag { margin: 0 auto 24px; } }

      .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 900;
        line-height: 1.1;
        color: #fff;
        margin-bottom: 24px;
        letter-spacing: -0.03em;
      }

      .hero-desc {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--muted);
        margin-bottom: 32px;
        max-width: 600px;
      }

      @media (max-width: 1024px) { .hero-desc { margin: 0 auto 32px; } }

      /* 3D Isometric Elements */
      .hero-3d {
        position: relative;
        width: 100%;
        height: 400px;
        perspective: 1000px;
        transform-style: preserve-3d;
      }

      .iso-box {
        position: absolute;
        transform: rotateX(60deg) rotateZ(-45deg);
        transform-style: preserve-3d;
        width: 100%;
        height: 100%;
      }

      .server-block {
        position: absolute;
        left: 20%; top: 30%;
        width: 120px; height: 120px;
        background: linear-gradient(135deg, rgba(30, 40, 55, 0.9), rgba(40, 50, 65, 0.8));
        border: 1px solid rgba(34, 211, 238, 0.3);
        transform: translateZ(60px);
        animation: float 6s ease-in-out infinite;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      }

      .terminal-screen {
        position: absolute;
        left: 40%; bottom: 10%;
        width: 180px; height: 120px;
        background: rgba(15, 20, 25, 0.95);
        border: 1px solid rgba(34, 211, 238, 0.4);
        transform: translateZ(20px) rotateX(-10deg);
        animation: float 8s ease-in-out infinite 1s;
        padding: 12px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: var(--cyan);
      }

      .card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid var(--stroke);
        border-radius: 20px;
        padding: 24px;
        transition: var(--transition);
        cursor: pointer;
      }

      .card:hover {
        border-color: var(--cyan);
        background: rgba(255, 255, 255, 0.06);
        transform: translateY(-4px);
      }
    </style>

    <div class="home-wrapper">
      <section class="hero-scene">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>

        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-tag">
              <div style="width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; animation: pulse 2s infinite;"></div>
              <span style="font-size: 12px; font-weight: 700; color: var(--cyan); text-transform: uppercase;">121 Edge Nodes Online</span>
            </div>
            <h1 class="hero-title">Orchestrate the <span style="background: linear-gradient(135deg, var(--cyan), var(--teal)); -webkit-background-clip: text; color: transparent;">Edge Economy</span></h1>
            <p class="hero-desc">
              Meauxbility is a hyper-scale deployment platform for intelligent edge nodes. 
              Manage global infrastructure, AI agents, and decentralized applications from a single interactive hub.
            </p>
            <div style="display: flex; gap: 16px; justify-content: inherit;">
              <button class="btn btn-primary" onclick="window.router.navigate('/dashboard/library')">Explore Galaxy</button>
              <button class="btn btn-secondary" onclick="window.router.navigate('/dashboard/upload')">Deploy Module</button>
            </div>
          </div>

          <div class="hero-3d">
            <div class="iso-box">
              <div class="server-block">
                <div style="position: absolute; inset: 20px; border: 2px solid rgba(34, 211, 238, 0.5); border-radius: 4px;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(34, 211, 238, 0.3); border-radius: 50%; box-shadow: 0 0 20px rgba(34, 211, 238, 0.6);"></div>
              </div>
              
              <div class="terminal-screen">
                <div style="opacity: 0.8;">$ meaux status --cluster global</div>
                <div style="opacity: 0.6; margin-top: 8px;">✓ 121 active edge nodes</div>
                <div style="opacity: 0.4; margin-top: 4px;">✓ Real-time sync enabled.</div>
                <div style="margin-top: 12px; color: #10B981; font-weight: 800;">STATUS: OPTIMIZED</div>
              </div>

              <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.6;">
                <path d="M 200 180 Q 300 200 380 160" stroke="rgba(34, 211, 238, 0.5)" stroke-width="2" fill="none" stroke-dasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Dynamic Cluster Module Grid -->
      <section style="padding: 80px 32px; max-width: 1400px; margin: 0 auto;">
        <h2 class="hero-title" style="font-size: 2rem;">Priority Cluster Modules</h2>
        <div id="home-modules-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 40px;">
          <div class="loading">Synchronizing with edge...</div>
        </div>
      </section>
    </div>
  `;
}

const featuredBuilds = [
  { name: "hybridprosaas-dashboard-production", type: "MCP PROD", desc: "Core infrastructure for the Meauxbility ecosystem." },
  { name: "autonomous-coding-agent", type: "AI NODE", desc: "Autonomous development and orchestration agent." },
  { name: "meauxaccessmvp", type: "MVP HUB", desc: "Next-generation access control and user management." },
  { name: "meauxstack-os", type: "OS CORE", desc: "Full-stack operating environment for cloud native apps." },
  { name: "official-dashboard", type: "DASHBOARD", desc: "Central management interface for global operations." },
  { name: "inneranimalmedia-production", type: "MEDIA PROD", desc: "High-performance media delivery network." }
];

export function init() {
  const grid = document.getElementById('home-modules-grid');
  if (!grid) return;

  grid.innerHTML = featuredBuilds.map(p => `
    <div class="card" onclick="window.router.navigate('/dashboard/library')">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
        <div class="logo-icon" style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, var(--cyan), var(--blue));">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <div style="font-weight: 800; color: #fff; font-size: 1.1rem;">${p.name}</div>
          <div style="font-size: 11px; color: var(--cyan); font-weight: 700;">${p.type}</div>
        </div>
      </div>
      <p style="font-size: 0.9rem; color: var(--muted); line-height: 1.5; margin-bottom: 20px;">
        ${p.desc}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--stroke);">
        <span style="font-size: 10px; color: var(--muted2); font-weight: 700;">ACTIVE IN CLUSTER</span>
        <span style="font-size: 10px; color: #10B981; font-weight: 800;">● ONLINE</span>
      </div>
    </div>
  `).join('');
}
