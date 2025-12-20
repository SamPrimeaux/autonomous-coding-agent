// Public Landing Home Component - High-End Agency Aesthetic
export default function LandingHome() {
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
          <a href="/" class="landing-nav-item ${currentPath === '/' ? 'active' : ''}" data-route="/">Home</a>
          <a href="/services" class="landing-nav-item ${currentPath === '/services' ? 'active' : ''}" data-route="/services">Services</a>
          <a href="/work" class="landing-nav-item ${currentPath === '/work' ? 'active' : ''}" data-route="/work">Work</a>
          <a href="/meauxmcp" class="landing-nav-item ${currentPath === '/meauxmcp' ? 'active' : ''}" data-route="/meauxmcp">MeauxMCP</a>
          <button class="landing-btn" onclick="window.router.navigate('/login')">Dashboard</button>
        </nav>
      </header>

      <section class="hero-scene" style="padding-top: 160px; min-height: 100vh; display: flex; align-items: center;">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-tag">
              <div style="width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; animation: pulse 2s infinite;"></div>
              <span style="font-size: 12px; font-weight: 700; color: var(--cyan); text-transform: uppercase;">Award-Winning Creative Studio</span>
            </div>
            <h1 class="hero-title">Transforming Ideas Into <span style="background: linear-gradient(135deg, var(--cyan), var(--teal)); -webkit-background-clip: text; color: transparent;">Digital Excellence</span></h1>
            <p class="hero-desc">
              We craft stunning digital experiences that elevate brands and captivate audiences through innovative design and cutting-edge edge-native development.
            </p>
            <div style="display: flex; gap: 16px;">
              <button class="btn btn-primary" onclick="window.router.navigate('/work')">View Our Work</button>
              <button class="btn btn-secondary" onclick="window.router.navigate('/services')">Our Services</button>
            </div>
          </div>
          
          <div class="hero-3d">
            <!-- Isometric Dev Scene -->
            <div class="iso-box">
              <div class="server-block">
                <div style="position: absolute; inset: 20px; border: 2px solid rgba(34, 211, 238, 0.5); border-radius: 4px;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(34, 211, 238, 0.3); border-radius: 50%; box-shadow: 0 0 20px rgba(34, 211, 238, 0.6);"></div>
              </div>
              <div class="terminal-screen" style="bottom: 20%; left: 35%;">
                <div style="color: var(--cyan); opacity: 0.9;">> Initializing agency.core...</div>
                <div style="color: #fff; margin-top: 8px;">✓ Design Systems Active</div>
                <div style="color: #fff; margin-top: 4px;">✓ Edge Cluster Ready</div>
                <div style="margin-top: 12px; font-weight: 800; color: var(--teal);">MISSION: EXCELLENCE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style="padding: 100px 40px; max-width: 1400px; margin: 0 auto; text-align: center;">
        <h2 style="font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 60px;">Trusted by Industry Leaders</h2>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 60px; opacity: 0.5;">
          <!-- Placeholder Logos -->
          <div style="font-size: 24px; font-weight: 800; color: #fff;">HYBRID</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff;">MEAUX</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff;">CLUSTER</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff;">GALAXY</div>
        </div>
      </section>
    </div>
  `;
}

export function init() {
    // Handle header nav clicks
    document.querySelectorAll('.landing-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = item.getAttribute('data-route');
            if (route) window.router.navigate(route);
        });
    });
}

