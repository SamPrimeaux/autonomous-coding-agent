// MeauxOS Navigation Component
function Navigation(currentRoute = '/') {
  const navItems = [
    { path: '/', label: 'App Library', icon: '📱', theme: 'light' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', theme: 'dark' },
    { path: '/dashboard/overview', label: 'Overview', icon: '🏠', theme: 'dark' },
    { path: '/dashboard/command', label: 'Command', icon: '⌘', theme: 'light' },
    { path: '/ai-gateway', label: 'AI Gateway', icon: '🤖', theme: 'light' },
    { path: '/browser-rendering', label: 'Browser', icon: '🖥️', theme: 'dark' },
    { path: '/dashboard/notifications', label: 'Notifications', icon: '🔔', theme: 'dark' },
    { path: '/dashboard/files', label: 'File Manager', icon: '📁', theme: 'light' },
    { path: '/dashboard/agents', label: 'Agents', icon: '⚡', theme: 'dark' },
    { path: '/dashboard/dev-tools', label: 'Dev Tools', icon: '🛠️', theme: 'light' },
    { path: '/dashboard/runtime', label: 'Runtime', icon: '🚀', theme: 'dark' }
  ];

  const currentItem = navItems.find(item => item.path === currentRoute) || navItems[0];
  const isDark = currentItem.theme === 'dark';

  return `
    <nav class="site-nav" data-theme="${currentItem.theme}" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
      background: ${isDark ? 'var(--bg-secondary)' : '#ffffff'};
      border-bottom: 1px solid ${isDark ? 'var(--border)' : '#e2e8f0'};
      z-index: 1000;
      display: flex;
      align-items: center;
      padding: 0 32px;
      box-shadow: ${isDark ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
      transition: all 0.3s ease;
    ">
      <!-- Logo -->
      <div class="nav-logo" style="
        display: flex;
        align-items: center;
        gap: 12px;
        margin-right: 48px;
        cursor: pointer;
        text-decoration: none;
      " onclick="window.router?.navigate('/')">
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${isDark ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))' : 'linear-gradient(135deg, var(--primary), var(--primary-light))'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: ${isDark ? 'var(--bg-primary)' : 'white'};
          box-shadow: ${isDark ? 'var(--glow-primary)' : '0 4px 12px rgba(31, 151, 169, 0.3)'};
        ">M</div>
        <div>
          <div style="
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: ${isDark ? 'var(--text-primary)' : 'var(--text)'};
            line-height: 1;
          ">MeauxOS</div>
          <div style="
            font-size: 0.6875rem;
            color: ${isDark ? 'var(--text-muted)' : 'var(--text-secondary)'};
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">Operating System</div>
        </div>
      </div>

      <!-- Nav Items -->
      <div class="nav-items" style="
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      ">
        ${navItems.map(item => {
    const isActive = item.path === currentRoute;
    return `
            <a href="${item.path}" 
               class="nav-link ${isActive ? 'active' : ''}" 
               data-path="${item.path}"
               data-theme="${item.theme}"
               style="
                 display: flex;
                 align-items: center;
                 gap: 8px;
                 padding: 10px 16px;
                 border-radius: 8px;
                 color: ${isActive
        ? (isDark ? 'var(--accent)' : 'var(--primary)')
        : (isDark ? 'var(--text-secondary)' : 'var(--text-secondary)')};
                 text-decoration: none;
                 font-size: 0.9375rem;
                 font-weight: ${isActive ? '600' : '500'};
                 background: ${isActive
        ? (isDark ? 'var(--accent-soft)' : 'rgba(31, 151, 169, 0.1)')
        : 'transparent'};
                 transition: all 0.2s ease;
                 white-space: nowrap;
                 cursor: pointer;
               "
               onclick="event.preventDefault(); window.router?.navigate('${item.path}'); return false;">
              <span style="font-size: 1.125rem;">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `;
  }).join('')}
      </div>

      <!-- Right Actions -->
      <div class="nav-actions" style="
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: 24px;
      ">
        <button class="theme-toggle" style="
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: ${isDark ? 'var(--bg-elevated)' : '#f1f5f9'};
          border: 1px solid ${isDark ? 'var(--border)' : '#e2e8f0'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.25rem;
          color: ${isDark ? 'var(--text-secondary)' : 'var(--text-secondary)'};
        " title="Toggle theme">
          ${isDark ? '☀️' : '🌙'}
        </button>
        <div class="user-avatar" style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${isDark ? 'var(--accent)' : 'var(--primary)'};
          color: ${isDark ? 'var(--bg-primary)' : 'white'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          border: 2px solid ${isDark ? 'var(--border)' : '#e2e8f0'};
        ">SP</div>
      </div>
    </nav>
  `;
}

function initNavigation() {
  console.log('Navigation init');

  // Handle nav link clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.dataset.path;
      if (window.router) {
        window.router.navigate(path);
      }
    });
  });

  // Update active state on route change
  const updateActiveNav = () => {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      const isActive = link.dataset.path === currentPath;
      link.classList.toggle('active', isActive);

      const theme = link.dataset.theme;
      const isDark = theme === 'dark';

      if (isActive) {
        link.style.color = isDark ? 'var(--accent)' : 'var(--primary)';
        link.style.background = isDark ? 'var(--accent-soft)' : 'rgba(31, 151, 169, 0.1)';
        link.style.fontWeight = '600';
      } else {
        link.style.color = 'var(--text-secondary)';
        link.style.background = 'transparent';
        link.style.fontWeight = '500';
      }
    });
  };

  // Update on route changes
  window.addEventListener('popstate', updateActiveNav);
  setInterval(updateActiveNav, 100);
}

export { Navigation as default, initNavigation };
