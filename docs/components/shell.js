// AutoMeaux Shell Component for MeauxOS
export default function Shell() {
  return `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <button class="hamburger" id="hamburger" aria-label="Toggle menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <div class="logo">MeauxOS</div>
        </div>
        <div class="header-right">
          <div class="header-search">
            <input id="global-search" placeholder="Search or type / to run a command..." />
            <div class="search-suggestions" id="global-search-suggestions"></div>
          </div>
          <div class="status-pill">
            <div class="status-dot"></div>
            <span>4 Connected</span>
          </div>
        </div>
      </div>
    </header>

    <div class="overlay" id="overlay"></div>

    <aside class="sidebar" id="sidebar">
      <nav>
        <ul class="nav">
          <li class="nav-section"><div class="nav-section-title">Core</div></li>
          <li class="nav-item">
            <a href="/" class="nav-link" data-route="/">
              <svg class="nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              <span class="nav-text">Home</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/r2" class="nav-link" data-route="/dashboard/r2">
              <svg class="nav-icon" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M8 10h8v4H8z"/></svg>
              <span class="nav-text">R2</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/upload" class="nav-link" data-route="/dashboard/upload">
              <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 3v14"/><path d="M5 10l7-7 7 7"/><path d="M5 21h14"/></svg>
              <span class="nav-text">Uploads</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/kanban" class="nav-link" data-route="/dashboard/kanban">
              <svg class="nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="4" height="14" rx="1"/></svg>
              <span class="nav-text">Kanban</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/chat-lite" class="nav-link" data-route="/dashboard/chat-lite">
              <svg class="nav-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span class="nav-text">Chat</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/repos" class="nav-link" data-route="/dashboard/repos">
              <svg class="nav-icon" viewBox="0 0 24 24"><path d="M4 4h16v4H4z"/><path d="M4 12h16v8H4z"/><path d="M8 4v16"/></svg>
              <span class="nav-text">Repos</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/gallery" class="nav-link" data-route="/dashboard/gallery">
              <svg class="nav-icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"/><circle cx="8.5" cy="11.5" r="1.5"/><path d="M21 15l-5-5-5 6"/></svg>
              <span class="nav-text">Gallery</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/terminal" class="nav-link" data-route="/dashboard/terminal">
              <svg class="nav-icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              <span class="nav-text">Terminal</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/dashboard/workflows" class="nav-link" data-route="/dashboard/workflows">
              <svg class="nav-icon" viewBox="0 0 24 24"><path d="M6 9h12M6 15h12"/><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/></svg>
              <span class="nav-text">Workflows</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav">
      <button class="mobile-nav-item" id="mobileMenuToggle">
        <div class="mobile-nav-menu">
          <div class="mobile-nav-menu-line"></div>
          <div class="mobile-nav-menu-line"></div>
          <div class="mobile-nav-menu-line"></div>
        </div>
        <span class="mobile-nav-label">Menu</span>
      </button>
      <a href="/" class="mobile-nav-item" data-route="/">
        <svg class="mobile-nav-icon" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span class="mobile-nav-label">Home</span>
      </a>
      <a href="/dashboard/r2" class="mobile-nav-item" data-route="/dashboard/r2">
        <svg class="mobile-nav-icon" viewBox="0 0 24 24">
          <path d="M4 6h16v12H4z"/><path d="M8 10h8v4H8z"/>
        </svg>
        <span class="mobile-nav-label">R2</span>
      </a>
      <a href="/dashboard/kanban" class="mobile-nav-item" data-route="/dashboard/kanban">
        <svg class="mobile-nav-icon" viewBox="0 0 24 24">
          <rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="4" height="14" rx="1"/>
        </svg>
        <span class="mobile-nav-label">Kanban</span>
      </a>
    </nav>

    <!-- Agent Toolbox (Bottom-Left) -->
    <button class="agent-toolbox" id="agentToolbox" aria-label="Multi-agent dev toolbox">
      <svg class="toolbox-icon" viewBox="0 0 24 24">
        <rect x="3" y="3" width="8" height="8" rx="2"/>
        <rect x="13" y="3" width="8" height="8" rx="2"/>
        <rect x="3" y="13" width="8" height="8" rx="2"/>
        <rect x="13" y="13" width="8" height="8" rx="2"/>
      </svg>
      <div class="agent-badge">4</div>
    </button>

    <!-- Clean Footer Navigation (Desktop Only) -->
    <footer class="footer-nav">
      <nav class="footer-nav-container">
        <a href="/" class="footer-nav-item" data-route="/">
          <div class="footer-nav-icon-wrapper">
            <svg class="footer-nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </div>
          <span class="footer-nav-text">Home</span>
        </a>
        <a href="/dashboard/r2" class="footer-nav-item" data-route="/dashboard/r2">
          <div class="footer-nav-icon-wrapper">
            <svg class="footer-nav-icon" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M8 10h8v4H8z"/></svg>
          </div>
          <span class="footer-nav-text">R2</span>
        </a>
        <a href="/dashboard/upload" class="footer-nav-item" data-route="/dashboard/upload">
          <div class="footer-nav-icon-wrapper">
            <svg class="footer-nav-icon" viewBox="0 0 24 24"><path d="M12 3v14"/><path d="M5 10l7-7 7 7"/><path d="M5 21h14"/></svg>
          </div>
          <span class="footer-nav-text">Upload</span>
        </a>
        <a href="/dashboard/kanban" class="footer-nav-item" data-route="/dashboard/kanban">
          <div class="footer-nav-icon-wrapper">
            <svg class="footer-nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="4" height="14" rx="1"/></svg>
          </div>
          <span class="footer-nav-text">Kanban</span>
        </a>
        <a href="/dashboard/chat-lite" class="footer-nav-item" data-route="/dashboard/chat-lite">
          <div class="footer-nav-icon-wrapper">
            <svg class="footer-nav-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <span class="footer-nav-text">Chat</span>
        </a>
      </nav>
    </footer>

    <!-- Persistent Chat Panel -->
    <div class="chat-panel" id="chatPanel">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
            </svg>
          </div>
          <div class="chat-header-text">
            <h3>Dev Assistant</h3>
            <p>AI-powered development chat</p>
          </div>
        </div>
        <button class="chat-close" id="chatClose" aria-label="Close chat">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-message assistant">
          <div class="chat-message-avatar">AI</div>
          <div class="chat-message-content">
            <div class="chat-message-bubble">
              Hey! I'm your persistent dev assistant. I'll follow you across all pages in MeauxOS. Ask me about deployments, code generation, or anything else!
              <div class="chat-context-pill">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Context: MeauxOS Dashboard
              </div>
            </div>
            <div class="chat-message-time">Just now</div>
          </div>
        </div>
      </div>
      <div class="chat-input-wrapper">
        <div class="chat-input-container">
          <textarea class="chat-input" id="chatInput" placeholder="Ask about deployments, code, or configurations..." rows="1"></textarea>
          <button class="chat-send" id="chatSend" aria-label="Send message">
            <svg viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Agent Toolbox Panel
  const agentToolbox = document.getElementById('agentToolbox');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  // Load chat state from localStorage
  const chatState = localStorage.getItem('agentToolboxOpen') === 'true';
  if (chatState && chatPanel && agentToolbox) {
    chatPanel.classList.add('active');
    agentToolbox.classList.add('active');
  }

  // Load chat history from localStorage
  const loadChatHistory = () => {
    if (!chatMessages) return;
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (history.length > 1) {
      chatMessages.innerHTML = '';
      history.forEach(msg => {
        addMessageToUI(msg.role, msg.content, false);
      });
    }
  };

  loadChatHistory();

  // Toggle chat panel
  if (agentToolbox && chatPanel) {
    agentToolbox.addEventListener('click', () => {
      const isActive = chatPanel.classList.toggle('active');
      agentToolbox.classList.toggle('active');
      localStorage.setItem('agentToolboxOpen', isActive);

      if (isActive && chatInput) {
        chatInput.focus();
      }
    });
  }

  if (chatClose && chatPanel && agentToolbox) {
    chatClose.addEventListener('click', () => {
      chatPanel.classList.remove('active');
      agentToolbox.classList.remove('active');
      localStorage.setItem('agentToolboxOpen', 'false');
    });
  }

  // Auto-resize textarea
  if (chatInput) {
    chatInput.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
  }

  // Add message to UI
  const addMessageToUI = (role, content, saveToHistory = true) => {
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const pageContext = document.querySelector('.page-title')?.textContent || 'MeauxOS';

    messageDiv.innerHTML = `
      <div class="chat-message-avatar">${role === 'user' ? 'You' : 'AI'}</div>
      <div class="chat-message-content">
        <div class="chat-message-bubble">
          ${content}
          ${role === 'assistant' ? `
          <div class="chat-context-pill">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Context: ${pageContext}
          </div>` : ''}
        </div>
        <div class="chat-message-time">${timeStr}</div>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (saveToHistory) {
      const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      history.push({ role, content, timestamp: now.toISOString(), page: pageContext });
      if (history.length > 50) history.shift();
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  };

  // Show typing indicator
  const showTyping = () => {
    if (!chatMessages) return;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="chat-message-avatar">AI</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const hideTyping = () => {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) typingIndicator.remove();
  };

  // Send message
  const sendMessage = async () => {
    if (!chatInput || !chatSend) return;
    const message = chatInput.value.trim();
    if (!message) return;

    addMessageToUI('user', message);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSend.disabled = true;

    showTyping();
    try {
      const resp = await fetch('/api/autorag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message, model: 'auto' })
      });
      const data = await resp.json();
      hideTyping();
      addMessageToUI('assistant', data?.response || 'No response yet.');
    } catch (err) {
      hideTyping();
      addMessageToUI('assistant', 'Error reaching AutoRAG. Please try again.');
    }
    if (chatSend) chatSend.disabled = false;
  };

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Close sidebar on nav link click (mobile)
  if (window.innerWidth < 769) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.dataset.route || link.getAttribute('href');
        if (route && window.router) {
          window.router.navigate(route);
        }
        if (hamburger && sidebar && overlay) {
          hamburger.classList.remove('active');
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
        }
      });
    });
  }

  // Mobile bottom nav menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (mobileMenuToggle && hamburger && sidebar && overlay) {
    mobileMenuToggle.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }

  // Handle navigation links
  document.querySelectorAll('[data-route], .nav-link, .footer-nav-item, .mobile-nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const route = link.dataset.route || href;
      if (route && route.startsWith('/') && window.router) {
        e.preventDefault();
        window.router.navigate(route);
        updateActiveNav(route);
      }
    });
  });

  // Update active nav state
  const updateActiveNav = (currentPath) => {
    document.querySelectorAll('.nav-link, .footer-nav-item, .mobile-nav-item').forEach(link => {
      const route = link.dataset.route || link.getAttribute('href');
      const isActive = route === currentPath || (currentPath.startsWith(route) && route !== '/');
      link.classList.toggle('active', isActive);
    });
  };

  // Initial nav state
  updateActiveNav(window.location.pathname);

  // Update on route changes
  window.addEventListener('popstate', () => {
    updateActiveNav(window.location.pathname);
  });
}
