// Command Palette Component for MeauxOS
export default function CommandPalette() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">Command Palette</h1>
      <p class="page-subtitle">Search and navigate quickly with ⌘K</p>
    </div>
    <div class="command-palette-page" data-theme="light" style="padding: 0;">
      <style>
        /* Scoped styles to avoid leaking */
        .command-palette-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: calc(100vh - 72px); padding: 32px 16px; }
        .command-shell { max-width: 960px; margin: 0 auto; position: relative; }
        /* Base styles from provided spec, namespaced */
        .command-palette-page :root[data-theme="light"] {}
        .command-palette-page * { box-sizing: border-box; }
        .command-palette-overlay { position: fixed; inset: 0; background: var(--surface-overlay, rgba(0,0,0,0.5)); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 80; display: flex; align-items: flex-start; justify-content: center; padding: 15vh 1rem 1rem; opacity: 0; visibility: hidden; transition: opacity 250ms ease, visibility 250ms ease; }
        .command-palette-overlay.active { opacity: 1; visibility: visible; }
        .command-palette { width: 100%; max-width: 640px; background: var(--bg-card, #0F1E32); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden; transform: scale(0.95) translateY(-20px); transition: transform 250ms ease; display: flex; flex-direction: column; max-height: 70vh; }
        .command-palette-overlay.active .command-palette { transform: scale(1) translateY(0); }
        .command-search { display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
        .command-search-icon { width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0; }
        .command-search-input { flex: 1; background: transparent; border: none; outline: none; font-size: 1rem; color: var(--text-primary); font-family: inherit; }
        .command-search-input::placeholder { color: var(--text-muted); }
        .command-search-close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; transition: all 150ms ease; flex-shrink: 0; }
        .command-search-close:hover { background: var(--bg-hover); color: var(--text-primary); }
        .command-filters { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; background: var(--bg-secondary); }
        .command-filters::-webkit-scrollbar { display: none; }
        .command-filter { padding: 8px 12px; background: transparent; border: 1px solid var(--border); border-radius: 8px; font-size: 0.875rem; color: var(--text-secondary); cursor: pointer; transition: all 150ms ease; white-space: nowrap; font-family: inherit; font-weight: 500; }
        .command-filter:hover { background: var(--bg-hover); border-color: var(--border-hover); }
        .command-filter.active { background: rgba(31, 151, 169, 0.1); border-color: var(--primary); color: var(--primary); }
        .command-results { flex: 1; overflow-y: auto; padding: 8px; background: var(--bg-primary); }
        .command-group { margin-bottom: 16px; }
        .command-group-title { padding: 8px 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
        .command-items { list-style: none; margin: 0; padding: 0; }
        .command-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 150ms ease; border: 1px solid transparent; }
        .command-item:hover { background: var(--bg-hover); }
        .command-item.selected { background: rgba(31, 151, 169, 0.1); border-color: var(--primary); }
        .command-item-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: var(--bg-secondary); color: var(--text-secondary); flex-shrink: 0; font-size: 1.25rem; }
        .command-item.selected .command-item-icon { background: rgba(31, 151, 169, 0.1); color: var(--primary); }
        .command-item-content { flex: 1; min-width: 0; }
        .command-item-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); display: flex; align-items: center; gap: 6px; }
        .command-item-title mark { background: var(--warning, #F59E0B); color: var(--neutral-900, #0A1628); padding: 0 2px; border-radius: 2px; }
        .command-item-description { font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .command-item-meta { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .command-badge { padding: 2px 6px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 4px; font-size: 0.625rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
        .command-badge.primary { background: rgba(31, 151, 169, 0.1); color: var(--primary); border-color: var(--primary); }
        .command-badge.success { background: rgba(16, 185, 129, 0.1); color: var(--success); border-color: var(--success); }
        .command-shortcut { display: flex; gap: 2px; }
        .kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; padding: 2px 5px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 3px; font-size: 0.625rem; font-family: 'JetBrains Mono', monospace; line-height: 1; color: var(--text-secondary); box-shadow: 0 1px 0 var(--border); }
        .command-empty, .command-loading { padding: 32px; text-align: center; color: var(--text-secondary); }
        .command-spinner { width: 32px; height: 32px; margin: 0 auto 12px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .command-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--border); background: var(--bg-secondary); }
        .command-footer-section { display: flex; align-items: center; gap: 16px; }
        .command-hint { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text-secondary); }
        .demo-controls { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; background: var(--bg-card); padding: 16px; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow-lg); margin-top: 16px; }
        .demo-btn { padding: 10px 14px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 150ms ease; display: inline-flex; align-items: center; gap: 8px; }
        .demo-btn:hover { background: var(--primary-hover, #26B4C9); }
        .demo-btn.secondary { background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border); }
        .demo-btn.secondary:hover { background: var(--bg-hover); }
        @media (max-width: 768px) { .command-palette { max-height: 80vh; } .command-footer .command-hint { display: none; } }
      </style>

      <div class="command-shell">
        <div class="command-palette-overlay" id="commandPaletteOverlay" role="dialog" aria-modal="true" aria-labelledby="command-palette-title">
          <div class="command-palette">
            <div class="command-search">
              <svg class="command-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke-width="2"></circle>
                <path d="M13 13l4 4" stroke-width="2" stroke-linecap="round"></path>
              </svg>
              <input type="text" class="command-search-input" id="commandSearchInput" placeholder="Search or type a command..." aria-label="Search for pages, files, or actions" autocomplete="off" spellcheck="false" />
              <button class="command-search-close" id="commandCloseBtn" aria-label="Close command palette">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            <div class="command-filters" role="tablist" aria-label="Filter results">
              <button class="command-filter active" data-filter="all" role="tab" aria-selected="true">All</button>
              <button class="command-filter" data-filter="pages" role="tab" aria-selected="false">Pages</button>
              <button class="command-filter" data-filter="files" role="tab" aria-selected="false">Files</button>
              <button class="command-filter" data-filter="actions" role="tab" aria-selected="false">Actions</button>
              <button class="command-filter" data-filter="people" role="tab" aria-selected="false">People</button>
            </div>
            <div class="command-results" id="commandResults" role="tabpanel"></div>
            <div class="command-footer">
              <div class="command-footer-section">
                <div class="command-hint"><span class="kbd">↑</span><span class="kbd">↓</span><span>Navigate</span></div>
                <div class="command-hint"><span class="kbd">↵</span><span>Select</span></div>
                <div class="command-hint"><span class="kbd">Esc</span><span>Close</span></div>
              </div>
              <div class="command-footer-section">
                <div class="command-hint"><span>Pro tip: Try math or conversions</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-controls">
          <button class="demo-btn" id="openCommandBtn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="7" cy="7" r="6" stroke="currentColor" fill="none" stroke-width="2"></circle>
              <path d="M12 12l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"></path>
            </svg>
            Open Command Palette <span class="kbd">⌘K</span>
          </button>
          <button class="demo-btn secondary" id="themeToggleCommand">Toggle Theme</button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Data
  const mockData = {
    pages: [
      { id: 'p1', title: 'Dashboard Overview', description: 'Main dashboard', icon: '📊', url: '/dashboard', category: 'MeauxWork' },
      { id: 'p2', title: 'Projects', description: '12 active projects', icon: '📁', url: '/dashboard/work/projects', category: 'MeauxWork' },
      { id: 'p3', title: 'Kanban Board', description: 'Task management', icon: '📋', url: '/dashboard/work/board', category: 'MeauxWork' },
      { id: 'p4', title: 'Library', description: 'Document library', icon: '📚', url: '/dashboard/work/library', category: 'MeauxWork' },
      { id: 'p5', title: 'MeauxPhoto', description: 'Photo editor', icon: '🖼️', url: '/dashboard/apps/photo', category: 'MeauxApps' },
      { id: 'p6', title: 'MeauxCAD', description: 'Design tool', icon: '📐', url: '/dashboard/apps/cad', category: 'MeauxApps' },
      { id: 'p7', title: 'Media Hub', description: 'Media management', icon: '🎬', url: '/dashboard/media', category: 'MeauxMedia', badge: 'NEW' },
      { id: 'p8', title: 'Social Media', description: 'Social scheduler', icon: '📱', url: '/dashboard/media/social', category: 'MeauxMedia' },
      { id: 'p9', title: 'Video Editor', description: 'Edit videos', icon: '🎥', url: '/dashboard/media/video', category: 'MeauxMedia' },
      { id: 'p10', title: 'Automation', description: 'Workflow automation', icon: '⚡', url: '/dashboard/auto', category: 'AutoMeaux', badge: 'NEW' },
      { id: 'p11', title: 'AI Assistant', description: 'AI-powered help', icon: '🤖', url: '/dashboard/auto/ai', category: 'AutoMeaux' },
      { id: 'p12', title: 'Dev Console', description: 'Developer tools', icon: '💻', url: '/dashboard/dev', category: 'MeauxDev' },
      { id: 'p13', title: 'MeauxMCP', description: 'MCP server', icon: '🔌', url: '/dashboard/dev/mcp', category: 'MeauxDev', badge: 'NEW' },
      { id: 'p14', title: 'Team Chat', description: '3 unread messages', icon: '💬', url: '/dashboard/chat', category: 'MeauxChat' },
      { id: 'p15', title: 'Mail', description: 'Email client', icon: '✉️', url: '/dashboard/chat/mail', category: 'MeauxChat' },
      { id: 'p16', title: 'Calendar', description: 'Schedule events', icon: '📅', url: '/dashboard/chat/calendar', category: 'MeauxChat' },
      { id: 'p17', title: 'Settings', description: 'Account settings', icon: '⚙️', url: '/dashboard/account/settings', category: 'Account' },
      { id: 'p18', title: 'Vault', description: 'Secure storage', icon: '🔒', url: '/dashboard/account/vault', category: 'Account' }
    ],
    files: [
      { id: 'f1', title: 'Q4 Report.docx', description: 'Modified 2 hours ago', icon: '📄', size: '2.4 MB', type: 'document' },
      { id: 'f2', title: 'Brand Guidelines.pdf', description: 'Modified yesterday', icon: '📋', size: '5.1 MB', type: 'pdf' },
      { id: 'f3', title: 'Logo-Final.svg', description: 'Modified 3 days ago', icon: '🎨', size: '124 KB', type: 'image' },
      { id: 'f4', title: 'Project Mockup.fig', description: 'Modified last week', icon: '📐', size: '8.7 MB', type: 'design' },
      { id: 'f5', title: 'Budget-2025.xlsx', description: 'Modified last month', icon: '📊', size: '342 KB', type: 'spreadsheet' },
      { id: 'f6', title: 'Presentation.pptx', description: 'Modified 2 weeks ago', icon: '📽️', size: '12.3 MB', type: 'presentation' }
    ],
    actions: [
      { id: 'a1', title: 'Create New Project', description: 'Start a new project', icon: '➕', action: 'create-project' },
      { id: 'a2', title: 'Upload Files', description: 'Upload to R2 storage', icon: '⬆️', action: 'upload-files' },
      { id: 'a3', title: 'Schedule Meeting', description: 'Create calendar event', icon: '🗓️', action: 'schedule-meeting' },
      { id: 'a4', title: 'Send Email', description: 'Compose new email', icon: '✉️', action: 'send-email' },
      { id: 'a5', title: 'Export Data', description: 'Export to CSV/JSON', icon: '📤', action: 'export-data' },
      { id: 'a6', title: 'Create Automation', description: 'New workflow', icon: '⚡', action: 'create-automation', badge: 'NEW' }
    ],
    people: [
      { id: 'u1', title: 'Sarah Johnson', description: 'Design Lead', icon: '👩‍💼', email: 'sarah@meauxbility.org' },
      { id: 'u2', title: 'Mike Chen', description: 'Developer', icon: '👨‍💻', email: 'mike@meauxbility.org' },
      { id: 'u3', title: 'Emily Davis', description: 'Project Manager', icon: '👩‍💼', email: 'emily@meauxbility.org' },
      { id: 'u4', title: 'Alex Rodriguez', description: 'Marketing', icon: '👨‍💼', email: 'alex@meauxbility.org' }
    ]
  };

  let recentSearches = [];
  try { recentSearches = JSON.parse(localStorage.getItem('meaux-recent-searches') || '[]'); } catch (_) { recentSearches = []; }
  let currentFilter = 'all';
  let selectedIndex = 0;
  let currentResults = [];
  let isCalculatorMode = false;

  const overlay = document.getElementById('commandPaletteOverlay');
  const searchInput = document.getElementById('commandSearchInput');
  const resultsContainer = document.getElementById('commandResults');
  const closeBtn = document.getElementById('commandCloseBtn');
  const openBtn = document.getElementById('openCommandBtn');
  const themeToggle = document.getElementById('themeToggleCommand');
  const filters = document.querySelectorAll('.command-filter');

  function fuzzyMatch(text, query) {
    text = (text || '').toLowerCase();
    query = (query || '').toLowerCase();
    let textIndex = 0, queryIndex = 0; const matches = [];
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) { matches.push(textIndex); queryIndex++; }
      textIndex++;
    }
    return queryIndex === query.length ? matches : null;
  }

  function highlightMatches(text, matches) {
    if (!matches || matches.length === 0) return text;
    let result = ''; let lastIndex = 0;
    matches.forEach(index => { result += text.slice(lastIndex, index); result += `<mark>${text[index]}</mark>`; lastIndex = index + 1; });
    result += text.slice(lastIndex); return result;
  }

  function tryCalculator(query) {
    try {
      const cleaned = query.replace(/[^0-9+\-*/().]/g, '');
      if (cleaned.length < query.length * 0.5) return null;
      const result = Function('"use strict"; return (' + cleaned + ')')();
      if (typeof result === 'number' && !isNaN(result)) {
        return { type: 'calculator', result, expression: query };
      }
    } catch (_) { }
    const conversions = {
      'km to miles': (n) => n * 0.621371,
      'miles to km': (n) => n * 1.60934,
      'kg to lbs': (n) => n * 2.20462,
      'lbs to kg': (n) => n / 2.20462,
      'c to f': (n) => n * 9 / 5 + 32,
      'f to c': (n) => (n - 32) * 5 / 9,
      'cm to inches': (n) => n / 2.54,
      'inches to cm': (n) => n * 2.54
    };
    for (const [pattern, converter] of Object.entries(conversions)) {
      const regex = new RegExp(`(\\d+\\.?\\d*)\\s*${pattern}`, 'i');
      const match = query.match(regex);
      if (match) {
        const value = parseFloat(match[1]);
        const result = converter(value);
        return { type: 'conversion', result, from: value, pattern };
      }
    }
    return null;
  }

  function search(query) {
    if (!query.trim()) return showRecent();
    const calcResult = tryCalculator(query);
    if (calcResult) { isCalculatorMode = true; return showCalculatorResult(calcResult); }
    isCalculatorMode = false;
    let dataToSearch = [];
    if (currentFilter === 'all') {
      dataToSearch = [
        ...mockData.pages.map(p => ({ ...p, type: 'page' })),
        ...mockData.files.map(f => ({ ...f, type: 'file' })),
        ...mockData.actions.map(a => ({ ...a, type: 'action' })),
        ...mockData.people.map(u => ({ ...u, type: 'person' }))
      ];
    } else if (currentFilter === 'pages') dataToSearch = mockData.pages.map(p => ({ ...p, type: 'page' }));
    else if (currentFilter === 'files') dataToSearch = mockData.files.map(f => ({ ...f, type: 'file' }));
    else if (currentFilter === 'actions') dataToSearch = mockData.actions.map(a => ({ ...a, type: 'action' }));
    else if (currentFilter === 'people') dataToSearch = mockData.people.map(u => ({ ...u, type: 'person' }));

    const results = dataToSearch
      .map(item => {
        const titleMatches = fuzzyMatch(item.title, query);
        const descMatches = fuzzyMatch(item.description || '', query);
        if (titleMatches || descMatches) {
          return { ...item, titleMatches, descMatches, score: (titleMatches ? titleMatches.length * 2 : 0) + (descMatches ? descMatches.length : 0) };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    currentResults = results; selectedIndex = 0; renderResults(results);
  }

  function showRecent() {
    if (!recentSearches.length) { renderDefaultView(); return; }
    const html = `
      <div class="command-group">
        <div class="command-group-title">Recent Searches</div>
        <ul class="command-items">
          ${recentSearches.slice(0, 5).map((search, index) => `
            <li class="command-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
              <div class="command-item-icon">🕐</div>
              <div class="command-item-content">
                <div class="command-item-title">${search}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    resultsContainer.innerHTML = html; addItemListeners();
  }

  function renderDefaultView() {
    const html = `
      <div class="command-group">
        <div class="command-group-title">Quick Actions</div>
        <ul class="command-items">
          ${mockData.actions.slice(0, 4).map((action, index) => `
            <li class="command-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}" data-id="${action.id}" data-action="${action.action || ''}" data-url="${action.url || ''}">
              <div class="command-item-icon">${action.icon}</div>
              <div class="command-item-content">
                <div class="command-item-title">
                  ${action.title}
                  ${action.badge ? `<span class="command-badge ${action.badge === 'NEW' ? 'success' : ''}">${action.badge}</span>` : ''}
                </div>
                <div class="command-item-description">${action.description}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="command-group">
        <div class="command-group-title">Popular Pages</div>
        <ul class="command-items">
          ${mockData.pages.slice(0, 6).map((page, index) => `
            <li class="command-item" data-index="${index + 4}" data-id="${page.id}" data-url="${page.url || ''}">
              <div class="command-item-icon">${page.icon}</div>
              <div class="command-item-content">
                <div class="command-item-title">
                  ${page.title}
                  ${page.badge ? `<span class="command-badge ${page.badge === 'NEW' ? 'success' : ''}">${page.badge}</span>` : ''}
                </div>
                <div class="command-item-description">${page.description}</div>
              </div>
              <div class="command-item-meta"><span class="command-badge">${page.category}</span></div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    resultsContainer.innerHTML = html; addItemListeners();
  }

  function showCalculatorResult(calcResult) {
    let html = '';
    if (calcResult.type === 'calculator') {
      html = `
        <div class="command-group">
          <div class="command-group-title">Calculator</div>
          <ul class="command-items">
            <li class="command-item selected" data-index="0">
              <div class="command-item-icon">🕐</div>
              <div class="command-item-content">
                <div class="command-item-title">${calcResult.expression} =</div>
                <div class="command-item-description" style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${calcResult.result}</div>
              </div>
              <div class="command-item-meta"><span class="command-badge primary">Copy</span></div>
            </li>
          </ul>
        </div>`;
    } else if (calcResult.type === 'conversion') {
      html = `
        <div class="command-group">
          <div class="command-group-title">Unit Conversion</div>
          <ul class="command-items">
            <li class="command-item selected" data-index="0">
              <div class="command-item-icon">🕐</div>
              <div class="command-item-content">
                <div class="command-item-title">${calcResult.from} ${calcResult.pattern}</div>
                <div class="command-item-description" style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${calcResult.result.toFixed(2)}</div>
              </div>
              <div class="command-item-meta"><span class="command-badge primary">Copy</span></div>
            </li>
          </ul>
        </div>`;
    }
    resultsContainer.innerHTML = html; addItemListeners();
  }

  function renderResults(results) {
    if (!results.length) {
      resultsContainer.innerHTML = `
        <div class="command-empty">
          <svg class="command-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <div class="command-empty-title">No results found</div>
          <div class="command-empty-description">Try searching for something else or use a different filter</div>
        </div>`;
      return;
    }
    const grouped = results.reduce((acc, item) => { if (!acc[item.type]) acc[item.type] = []; acc[item.type].push(item); return acc; }, {});
    const typeLabels = { page: 'Pages', file: 'Files', action: 'Actions', person: 'People' };
    let html = ''; let globalIndex = 0;
    for (const [type, items] of Object.entries(grouped)) {
      html += `
        <div class="command-group">
          <div class="command-group-title">${typeLabels[type] || type}</div>
          <ul class="command-items">
            ${items.map(item => {
        const itemHtml = `
                <li class="command-item ${globalIndex === selectedIndex ? 'selected' : ''}" data-index="${globalIndex}" data-id="${item.id}" data-url="${item.url || ''}" data-action="${item.action || ''}">
                  <div class="command-item-icon">${item.icon}</div>
                  <div class="command-item-content">
                    <div class="command-item-title">
                      ${item.titleMatches ? highlightMatches(item.title, item.titleMatches) : item.title}
                      ${item.badge ? `<span class="command-badge ${item.badge === 'NEW' ? 'success' : ''}">${item.badge}</span>` : ''}
                    </div>
                    <div class="command-item-description">${item.descMatches ? highlightMatches(item.description, item.descMatches) : item.description}</div>
                  </div>
                  <div class="command-item-meta">${item.category ? `<span class="command-badge">${item.category}</span>` : ''} ${item.size ? `<span class="command-badge">${item.size}</span>` : ''}</div>
                </li>`;
        globalIndex++; return itemHtml;
      }).join('')}
          </ul>
        </div>`;
    }
    resultsContainer.innerHTML = html; addItemListeners();
  }

  function addItemListeners() {
    const items = resultsContainer.querySelectorAll('.command-item');
    items.forEach(item => {
      item.addEventListener('click', () => selectItem(parseInt(item.dataset.index)));
      item.addEventListener('mouseenter', () => { selectedIndex = parseInt(item.dataset.index); updateSelection(); });
    });
  }

  function updateSelection() {
    const items = resultsContainer.querySelectorAll('.command-item');
    items.forEach((item, index) => {
      if (index === selectedIndex) { item.classList.add('selected'); item.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      else item.classList.remove('selected');
    });
  }

  function selectItem(index = selectedIndex) {
    if (isCalculatorMode) {
      const resultElement = resultsContainer.querySelector('.command-item-description');
      if (resultElement) { const text = resultElement.textContent; navigator.clipboard.writeText(text || '').then(() => closeCommandPalette()); }
      return;
    }
    const items = resultsContainer.querySelectorAll('.command-item');
    if (items[index]) {
      const item = items[index];
      const itemId = item.dataset.id;
      const url = item.dataset.url;
      const action = item.dataset.action;
      const query = searchInput.value.trim();
      if (query) { recentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10); localStorage.setItem('meaux-recent-searches', JSON.stringify(recentSearches)); }
      handleNavigation(url, action);
      closeCommandPalette();
    }
  }

  function handleNavigation(url, action) {
    if (url) {
      if (window.router && typeof window.router.navigate === 'function') {
        window.router.navigate(url);
      } else {
        window.location.href = url;
      }
      return;
    }
    if (!action) return;
    switch (action) {
      case 'create-project':
        return window.router?.navigate('/dashboard/kanban');
      case 'upload-files':
        return window.router?.navigate('/dashboard/r2');
      case 'schedule-meeting':
        return window.router?.navigate('/dashboard/meet');
      case 'send-email':
        return window.router?.navigate('/dashboard/chat/mail');
      case 'export-data':
        return window.router?.navigate('/dashboard/repos');
      case 'create-automation':
        return window.router?.navigate('/dashboard/workflows');
      default:
        return;
    }
  }

  function openCommandPalette() {
    overlay.classList.add('active'); searchInput.focus(); document.body.style.overflow = 'hidden'; if (!searchInput.value.trim()) renderDefaultView();
  }
  function closeCommandPalette() { overlay.classList.remove('active'); searchInput.value = ''; searchInput.blur(); document.body.style.overflow = ''; selectedIndex = 0; isCalculatorMode = false; }

  openBtn?.addEventListener('click', openCommandPalette);
  closeBtn?.addEventListener('click', closeCommandPalette);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeCommandPalette(); });
  searchInput?.addEventListener('input', (e) => search(e.target.value));
  searchInput?.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('.command-item'); const maxIndex = items.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, maxIndex); updateSelection(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); updateSelection(); }
    else if (e.key === 'Enter') { e.preventDefault(); selectItem(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeCommandPalette(); }
  });

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => { f.classList.remove('active'); f.setAttribute('aria-selected', 'false'); });
      filter.classList.add('active'); filter.setAttribute('aria-selected', 'true'); currentFilter = filter.dataset.filter; selectedIndex = 0; search(searchInput.value);
    });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); overlay.classList.contains('active') ? closeCommandPalette() : openCommandPalette(); }
  });

  themeToggle?.addEventListener('click', () => {
    const html = document.documentElement; const currentTheme = html.getAttribute('data-theme'); const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme); localStorage.setItem('meaux-theme', newTheme);
  });

  const savedTheme = localStorage.getItem('meaux-theme') || document.documentElement.getAttribute('data-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  renderDefaultView();
}
