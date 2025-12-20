// Agency Services Component
export default function Services() {
    const currentPath = window.location.pathname;
    const services = [
        { title: 'Web Design & Development', count: 8, desc: 'Beautiful, responsive websites built with cutting-edge technology and optimized for performance.', icon: '🌐' },
        { title: 'Brand Identity', count: 12, desc: 'Distinctive brand identities that capture your essence and resonate with your audience.', icon: '🎨' },
        { title: 'UI/UX Design', count: 15, desc: 'Intuitive interfaces designed with user experience at the forefront of every decision.', icon: '📱' },
        { title: 'Content Creation', count: 10, desc: 'Compelling content strategies that tell your story and engage your community.', icon: '✍️' },
        { title: 'Digital Strategy', count: 6, desc: 'Data-driven strategies to maximize your digital presence and achieve business goals.', icon: '📈' },
        { title: 'SEO & Marketing', count: 9, desc: 'Strategic optimization and marketing campaigns that drive traffic and conversions.', icon: '🔍' }
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
          <a href="/services" class="landing-nav-item active" data-route="/services">Services</a>
          <a href="/work" class="landing-nav-item" data-route="/work">Work</a>
          <a href="/meauxmcp" class="landing-nav-item" data-route="/meauxmcp">MeauxMCP</a>
          <button class="landing-btn" onclick="window.router.navigate('/login')">Dashboard</button>
        </nav>
      </header>

      <section style="padding: 160px 40px 100px; max-width: 1400px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 80px;">
          <h1 style="font-size: 48px; font-weight: 900; color: #fff; margin-bottom: 24px;">Our Services</h1>
          <p style="font-size: 18px; color: var(--muted); max-width: 700px; margin: 0 auto;">
            From architectural design to full-scale edge deployment, we provide the tools and expertise to build the future of the decentralized web.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 32px;">
          ${services.map(s => `
            <div class="card" style="padding: 40px; text-align: left;">
              <div style="font-size: 40px; margin-bottom: 24px;">${s.icon}</div>
              <h3 style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 16px;">${s.title}</h3>
              <p style="font-size: 16px; color: var(--muted); line-height: 1.6; margin-bottom: 24px;">${s.desc}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--stroke);">
                <span style="font-size: 13px; font-weight: 700; color: var(--cyan);">${s.count} PROJECTS COMPLETED</span>
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

