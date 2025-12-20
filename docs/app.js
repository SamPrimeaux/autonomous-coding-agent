// SPA Router & Orchestrator
class Router {
  constructor() {
    this.routes = {
      '/': () => this.showView('landing-home'),
      '/services': () => this.showView('services'),
      '/work': () => this.showView('work'),
      '/meauxmcp': () => this.showView('meauxmcp'),
      '/login': () => this.showView('login'),
      '/dashboard': () => this.showView('home'),
      '/dashboard/library': () => this.showView('app-library'),
      '/dashboard/terminal': () => this.showView('terminal'),
      '/dashboard/r2': () => this.showView('r2-dashboard'),
      '/dashboard/design': () => this.showView('meaux-design'),
      '/dashboard/upload': () => this.showView('smart-upload'),
      '/dashboard/repos': () => this.showView('repos'),
      '/dashboard/workflows': () => this.showView('workflow-builder'),
      '/dashboard/developer-tools': () => this.showView('developer-tools'),
      '/dashboard/analytics': () => this.showView('analytics'),
      '/dashboard/agents': () => this.showView('agents'),
      '/dashboard/chat': () => this.showView('chat-lite'),
      '/dashboard/mail': () => this.showView('mail'),
      '/dashboard/photo': () => this.showView('meauxphoto'),
      '/dashboard/board': () => this.showView('meauxboard'),
      '/dashboard/kv': () => this.showView('kv-storage'),
      '/dashboard/ai-gateway': () => this.showView('ai-gateway'),
      '/dashboard/mcp': () => this.showView('mcp-control'),
      '/dashboard/commerce': () => this.showView('stripe')
    };
    this.currentView = null;
    this.init();
  }

  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const isAuth = localStorage.getItem('meaux_auth') === 'true';
    const isPublicPath = ['/', '/services', '/work', '/meauxmcp', '/login'].includes(path);

    if (!isPublicPath && !isAuth) {
      this.navigate('/login');
      return;
    }

    if (path === '/login' && isAuth) {
      this.navigate('/dashboard');
      return;
    }

    const handler = this.routes[path] || this.routes['/'];
    handler();
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  async showView(viewName) {
    const container = document.getElementById('view-container');
    const shellContainer = document.getElementById('shell-container');
    const isPublicView = ['landing-home', 'services', 'work', 'meauxmcp', 'login'].includes(viewName);

    // Set shell mode
    if (shellContainer) {
      if (viewName === 'login') {
        shellContainer.classList.add('no-shell');
        shellContainer.classList.remove('public-shell');
      } else if (isPublicView) {
        shellContainer.classList.add('public-shell');
        shellContainer.classList.remove('no-shell');
      } else {
        shellContainer.classList.remove('no-shell');
        shellContainer.classList.remove('public-shell');
      }
    }

    if (!container) return;

    // Update active nav link
    document.querySelectorAll('.nav-item, .mobile-nav-item, .submenu-item').forEach(item => {
      const route = item.dataset.route;
      item.classList.toggle('active', route === window.location.pathname);
    });

    // Clear and show loading
    container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-muted);">Initializing module...</div>';

    try {
      const v = window.__ASSET_V || '';
      const module = await import(`/components/${viewName}.js${v}`);

      if (module.default) {
        container.innerHTML = `<div id="${viewName}-view" class="view active">${module.default()}</div>`;
        if (module.init) {
          module.init();
        }
      }
    } catch (error) {
      console.error('Failed to load view:', viewName, error);
      container.innerHTML = `<div style="padding: 40px; text-align: center; color: #ef4444;">Module error: ${error.message}</div>`;
    }
  }
}

// Global Shell Loader
async function loadApp() {
  try {
    const v = window.__ASSET_V || '';
    const shellModule = await import(`/components/shell.js${v}`);
    const shellContainer = document.getElementById('shell-container');

    if (shellContainer && shellModule.default) {
      shellContainer.innerHTML = shellModule.default();
      if (shellModule.init) shellModule.init();

      window.router = new Router();
    }
  } catch (error) {
    console.error('Core failure:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadApp);
