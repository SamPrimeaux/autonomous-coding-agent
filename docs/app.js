// SPA Router
class Router {
  constructor() {
    this.routes = {
      '/': () => this.showView('home'),
      '/dashboard': () => this.showView('dashboard'),
      '/dashboard/command': () => this.showView('command-palette'),
      '/dashboard/notifications': () => this.showView('notifications-panel'),
      '/ai-gateway': () => this.showView('ai-gateway'),
      '/browser-rendering': () => this.showView('browser-rendering'),
      '/app-library': () => this.showView('app-library'),
      '/dashboard/overview': () => this.showView('overview'),
      '/dashboard/agents': () => this.showView('agents'),
      '/dashboard/dev-tools': () => this.showView('dev-tools'),
      '/dashboard/runtime': () => this.showView('runtime'),
      '/dashboard/files': () => this.showView('file-manager'),
      // MeauxWork routes
      '/dashboard/work/projects': () => this.showView('projects'),
      '/dashboard/work/board': () => this.showView('meauxboard'),
      '/dashboard/work/library': () => this.showView('library'),
      '/dashboard/work/docs': () => this.showView('meauxdocs'),
      '/dashboard/work/hosting': () => this.showView('hosting'),
      // MeauxApps routes
      '/dashboard/apps': () => this.showView('app-library'),
      '/dashboard/apps/photo': () => this.showView('meauxphoto'),
      '/dashboard/apps/cad': () => this.showView('meauxcad'),
      '/dashboard/apps/spline': () => this.showView('spline-ai'),
      '/dashboard/apps/cloud': () => this.showView('meauxcloud'),
      '/dashboard/apps/assets': () => this.showView('intelligent-assets'),
      // MeauxDev routes
      '/dashboard/dev': () => this.showView('dev-tools'),
      '/dashboard/dev/mcp': () => this.showView('mcp-control'),
      '/dashboard/dev/sql': () => this.showView('sql-editor'),
      '/dashboard/dev/workers': () => this.showView('workers'),
      '/dashboard/dev/kv': () => this.showView('kv-storage'),
      '/dashboard/dev/vercel': () => this.showView('vercel'),
      '/dashboard/dev/supabase': () => this.showView('supabase'),
      '/dashboard/dev/stripe': () => this.showView('stripe'),
      '/dashboard/dev/keys': () => this.showView('api-keys'),
      // MeauxChat routes
      '/dashboard/chat': () => this.showView('meauxtalk'),
      '/dashboard/chat/talk': () => this.showView('meauxtalk'),
      '/dashboard/chat/mail': () => this.showView('mail'),
      '/dashboard/chat/phone': () => this.showView('phone'),
      '/dashboard/chat/calendar': () => this.showView('calendar'),
      '/dashboard/chat/meet': () => this.showView('meet'),
      // AutoMeaux routes
      '/dashboard/auto': () => this.showView('automation'),
      '/dashboard/auto/pipeline': () => this.showView('content-pipeline'),
      '/dashboard/auto/prompts': () => this.showView('prompt-portal'),
      // Unified Dashboard & Tools
      '/dashboard/unified': () => this.showView('unified-dashboard'),
      '/dashboard/terminal': () => this.showView('terminal'),
      '/dashboard/workflows': () => this.showView('workflow-builder'),
      '/dashboard/upload': () => this.showView('smart-upload'),
      '/dashboard/r2': () => this.showView('r2-dashboard'),
      '/dashboard/kanban': () => this.showView('kanban'),
      '/dashboard/chat-lite': () => this.showView('chat-lite'),
      '/dashboard/repos': () => this.showView('repos'),
      '/dashboard/gallery': () => this.showView('gallery'),
      '/dashboard/auto/options': () => this.showView('meauxoptions'),
      '/dashboard/auto/optimization': () => this.showView('optimization'),
      // Account routes
      '/dashboard/account/settings': () => this.showView('settings'),
      '/dashboard/account/pass': () => this.showView('meauxpass'),
      '/dashboard/account/vault': () => this.showView('secure-vault'),
      '/dashboard/account/wallet': () => this.showView('wallet')
    };
    this.currentView = null;
    this.init();
  }

  init() {
    console.log('Router init');
    window.addEventListener('popstate', () => this.handleRoute());
    if (document.readyState === 'loading') {
      window.addEventListener('load', () => this.handleRoute());
    } else {
      this.handleRoute();
    }
  }

  handleRoute() {
    const path = window.location.pathname;
    console.log('Handling route:', path);
    const handler = this.routes[path] || this.routes['/'];
    try {
      handler();
    } catch (error) {
      console.error('Error in route handler:', error);
    }
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  showView(viewName) {
    console.log('Showing view:', viewName);

    // Update navigation
    this.updateNavigation();

    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
      view.style.display = 'none';
    });
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) errorDiv.style.display = 'none';

    // Show target view
    const viewElement = document.getElementById(`${viewName}-view`);
    if (viewElement) {
      viewElement.style.display = 'block';
      viewElement.classList.add('active');
      this.currentView = viewName;

      // Apply theme based on route
      this.applyTheme(viewName);

      // Update navigation active states
      this.updateNavigation();

      // Scroll to top
      window.scrollTo(0, 0);

      // Load component if not loaded
      if (!viewElement.dataset.loaded) {
        this.loadComponent(viewName).then(() => {
          // Hide loading message only after component loads successfully
          const loading = document.getElementById('loading');
          if (loading) {
            loading.style.display = 'none';
          }
        }).catch((error) => {
          console.error('Failed to load component:', error);
          // Keep loading message or show error
        });
      } else {
        // Component already loaded, hide loading
        const loading = document.getElementById('loading');
        if (loading) {
          loading.style.display = 'none';
        }
      }
    } else {
      console.error('View element not found:', viewName + '-view');
    }
  }

  async loadComponent(componentName) {
    console.log('Loading component:', componentName);
    const viewElement = document.getElementById(`${componentName}-view`);
    if (!viewElement) {
      console.error('View element not found for component:', componentName);
      return;
    }

    // Show loading state
    viewElement.innerHTML = '<div style="padding: 40px; text-align: center; color: #64748b;">Loading ' + componentName + '...</div>';
    viewElement.style.display = 'block';

    try {
      const module = await import(`/components/${componentName}.js`);
      if (module.default && typeof module.default === 'function') {
        viewElement.innerHTML = module.default();
        viewElement.dataset.loaded = 'true';
        // Initialize component if it has an init method
        if (module.init) {
          try {
            module.init();
          } catch (initError) {
            console.error('Error in component init:', initError);
          }
        }
        console.log('Component loaded:', componentName);
      } else {
        throw new Error('Component default export is not a function');
      }
    } catch (error) {
      console.error('Failed to load component ' + componentName + ':', error);
      viewElement.innerHTML = `<div style="padding: 40px; text-align: center;"><h2>Error loading component</h2><p>${error.message}</p><p style="color: #64748b; font-size: 12px; margin-top: 10px;">Component: ${componentName}.js</p><p style="color: #64748b; font-size: 12px;">Check browser console for details</p></div>`;
    }
  }

  updateNavigation() {
    // Navigation is now handled by shell component
    // Update active states in shell
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .footer-nav-item, .mobile-nav-item').forEach(link => {
      const route = link.dataset.route || link.getAttribute('href');
      const isActive = route === currentPath || (currentPath.startsWith(route) && route !== '/');
      link.classList.toggle('active', isActive);
    });
  }

  applyTheme(viewName) {
    const themeMap = {
      'dashboard': 'dark',
      'command-palette': 'light',
      'notifications-panel': 'dark',
      'app-library': 'light',
      'overview': 'dark',
      'ai-gateway': 'light',
      'browser-rendering': 'dark',
      'file-manager': 'light',
      'agents': 'dark',
      'dev-tools': 'light',
      'runtime': 'dark'
    };
    const theme = themeMap[viewName] || 'dark';
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Load shell component
async function loadShell() {
  try {
    const shellModule = await import('/components/shell.js');
    window.Shell = shellModule.default;
    window.initShell = shellModule.init;

    // Initial shell render
    const shellContainer = document.getElementById('shell-container');
    if (shellContainer && window.Shell) {
      shellContainer.innerHTML = window.Shell();
      if (window.initShell) {
        window.initShell();
      }
    }
  } catch (error) {
    console.error('Failed to load shell:', error);
  }
}

// Initialize router when DOM is ready
console.log('App.js loaded');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing router');
    await loadShell();
    window.router = new Router();
  });
} else {
  console.log('DOM already ready, initializing router');
  loadShell().then(() => {
    window.router = new Router();
  });
}
