// Agency Portfolio Component
export default function Work() {
    const currentPath = window.location.pathname;
    const projects = [
        { title: 'Meauxbility OS', category: 'Infrastructure', image: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar' },
        { title: 'Galaxy Node Hub', category: 'AI Orchestration', image: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar' },
        { title: 'Inner Animal Portal', category: 'Brand Identity', image: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar' },
        { title: 'Edge Commerce Hub', category: 'Web Development', image: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar' },
        { title: 'Secure Vault OS', category: 'Cybersecurity', image: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar' },
        { title: 'Smart Upload v2', category: 'UI/UX Design', image: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar' }
    ];

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
          <a href="/work" class="landing-nav-item active" data-route="/work">Work</a>
          <a href="/meauxmcp" class="landing-nav-item" data-route="/meauxmcp">MeauxMCP</a>
          <button class="landing-btn" onclick="window.router.navigate('/login')">Dashboard</button>
        </nav>
      </header>

      <section style="padding: 160px 40px 100px; max-width: 1400px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 80px;">
          <h1 style="font-size: 48px; font-weight: 900; color: #fff; margin-bottom: 24px;">Our Work</h1>
          <p style="font-size: 18px; color: var(--muted); max-width: 700px; margin: 0 auto;">
            A collection of digital excellence, ranging from enterprise cloud systems to award-winning brand transformations.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px;">
          ${projects.map(p => `
            <div class="card" style="padding: 0; overflow: hidden; height: 400px; position: relative; group">
              <img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: var(--transition);" class="project-img">
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,16,34,0.9), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 40px;">
                <div style="font-size: 12px; font-weight: 800; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${p.category}</div>
                <h3 style="font-size: 28px; font-weight: 900; color: #fff;">${p.title}</h3>
              </div>
            </div>
          `).join('')}
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
}

