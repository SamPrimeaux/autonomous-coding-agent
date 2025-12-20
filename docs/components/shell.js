// Refined Shell Component - Frosted White Galaxy Theme
export default function Shell() {
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'home', route: '/', label: 'Dashboard', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>' },
        { id: 'library', route: '/dashboard/library', label: 'App Library', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
        { id: 'terminal', route: '/dashboard/terminal', label: 'Workers', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
        { id: 'commerce', route: '/dashboard/commerce', label: 'Commerce', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>' },
        { id: 'analytics', route: '/dashboard/analytics', label: 'Analytics', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' }
      ]
    },
    {
      title: 'APPS',
      items: [
        { id: 'design', route: '/dashboard/design', label: 'MeauxDesign', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>' },
        { id: 'mail', route: '/dashboard/mail', label: 'Mail', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
        { id: 'chat', route: '/dashboard/chat', label: 'Chat', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>' },
        { id: 'board', route: '/dashboard/board', label: 'Whiteboard', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' }
      ]
    },
    {
      title: 'INFRA',
      items: [
        { id: 'r2', route: '/dashboard/r2', label: 'Storage', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>' },
        { id: 'ai-gateway', route: '/dashboard/ai-gateway', label: 'AI Gateway', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' }
      ]
    },
    {
      title: 'DEVELOP',
      items: [
        { id: 'agents', route: '/dashboard/agents', label: 'AI Agents', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h6l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
        { id: 'workflows', route: '/dashboard/workflows', label: 'Workflows', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
        { id: 'dev-tools', route: '/dashboard/developer-tools', label: 'Dev Tools', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>' }
      ]
    }
  ];

  const bottomNavItems = [
    navSections[0].items[0], // Home
    navSections[0].items[1], // Library
    navSections[0].items[3], // Commerce
    navSections[3].items[0]  // Agents
  ];

  const currentPath = window.location.pathname;

  return `
    <div class="mobile-overlay" id="mobileOverlay"></div>
    
    <nav class="sidenav" id="sidenav">
      <div class="sidenav-header">
        <a href="/" class="logo">
          <div class="logo-icon">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
          </div>
          <div class="logo-text-group">
            <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">Meauxbility</div>
            <div style="font-size: 11px; color: #94A3B8; font-weight: 500;">Workers Platform</div>
          </div>
        </a>
        <button class="nav-toggle" id="navToggle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
      </div>

      <div class="sidenav-content" style="flex: 1; overflow-y: auto; padding: 16px 12px;">
        ${navSections.map(section => `
          <div class="nav-section">
            <div class="nav-section-title">${section.title}</div>
            ${section.items.map(item => `
              <a href="${item.route}" class="nav-item ${currentPath === item.route ? 'active' : ''}" data-route="${item.route}">
                <div class="nav-icon">${item.icon}</div>
                <span class="nav-text">${item.label}</span>
              </a>
            `).join('')}
          </div>
        `).join('')}
      </div>
      </div>

      <!-- Sidebar Footer Profile -->
      <div style="padding: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; transition: all 0.2s;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #22D3EE, #3B82F6); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;">SP</div>
          <div class="nav-text" style="flex: 1; min-width: 0;">
            <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Sam Primeaux</div>
            <div style="font-size: 11px; color: #64748B;">Settings</div>
          </div>
        </div>
      </div>
    </nav>

    <div class="main-content">
      <div class="topbar">
        <button class="mobile-menu-btn" id="mobileMenuBtn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="topbar-right">
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>Cluster Synchronized</span>
          </div>
          <button class="theme-toggle" id="themeToggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="view-container"></div>
    </div>

    <!-- Mobile Bottom Nav -->
    <nav class="mobile-bottom-nav">
      ${bottomNavItems.map(item => `
        <a href="${item.route}" class="mobile-nav-item ${currentPath === item.route ? 'active' : ''}" data-route="${item.route}">
          <div class="mobile-nav-icon">${item.icon}</div>
          <span class="mobile-nav-label">${item.label}</span>
        </a>
      `).join('')}
    </nav>

    <!-- Sitewide Live Agent SAM -->
    <div id="meaux-pilot-container" style="position: fixed; bottom: 80px; right: 20px; z-index: 9999;">
      <div id="meaux-pilot-bubble" style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--cyan), var(--blue)); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 32px rgba(34, 211, 238, 0.4); border: 2px solid rgba(255,255,255,0.2); transition: var(--transition);">
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
        <div id="meaux-pilot-status" style="position: absolute; top: 0; right: 0; width: 14px; height: 14px; background: #10B981; border: 2px solid #fff; border-radius: 50%;"></div>
      </div>
      
      <div id="meaux-pilot-window" style="display: none; position: absolute; bottom: 70px; right: 0; width: 360px; height: 500px; background: var(--glass2); backdrop-filter: blur(40px); border: 1px solid var(--stroke); border-radius: 20px; flex-direction: column; overflow: hidden; box-shadow: var(--shadow);">
        <div style="padding: 16px; border-bottom: 1px solid var(--stroke); background: var(--nav-glass); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, var(--cyan), var(--blue)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 14px;">SAM</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: #fff;">Agent SAM</div>
              <div style="font-size: 10px; color: #10B981; font-weight: 700;">● LIVE CLUSTER SYNC</div>
            </div>
          </div>
          <button id="meaux-pilot-close" style="background: none; border: none; color: var(--muted); cursor: pointer; padding: 4px;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div id="meaux-pilot-messages" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <div style="background: var(--nav-glass); border: 1px solid var(--stroke); padding: 12px; border-radius: 12px; color: #fff; font-size: 13px; line-height: 1.5; max-width: 85%;">
            Greetings! I am SAM (MeauxControlPilot). I am synchronized with your 121 edge nodes. How can I guide your team through the current workflow?
          </div>
        </div>
        <div style="padding: 12px; border-top: 1px solid var(--stroke); background: var(--nav-glass); display: flex; gap: 8px;">
          <input id="meaux-pilot-input" placeholder="Ask anything about the cluster..." style="flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--stroke); border-radius: 10px; color: #fff; font-size: 13px; outline: none;">
          <button id="meaux-pilot-send" style="padding: 10px; background: var(--cyan); border: none; border-radius: 10px; color: #fff; cursor: pointer;">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div style="padding: 8px 12px; border-top: 1px solid var(--stroke); background: var(--nav-glass); display: flex; justify-content: center;">
          <button id="meaux-facetime-invite" class="btn btn-secondary" style="font-size: 11px; padding: 6px 12px; width: 100%; border-color: var(--cyan); color: var(--cyan);">
            📲 Send FaceTime Invite (Resend Test)
          </button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const sidenav = document.getElementById('sidenav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const themeToggle = document.getElementById('themeToggle');

  // Agent SAM Controls
  const pilotBubble = document.getElementById('meaux-pilot-bubble');
  const pilotWindow = document.getElementById('meaux-pilot-window');
  const pilotClose = document.getElementById('meaux-pilot-close');
  const pilotInput = document.getElementById('meaux-pilot-input');
  const pilotSend = document.getElementById('meaux-pilot-send');
  const pilotMessages = document.getElementById('meaux-pilot-messages');

  pilotBubble?.addEventListener('click', () => {
    pilotWindow.style.display = pilotWindow.style.display === 'none' ? 'flex' : 'none';
    if (pilotWindow.style.display === 'flex') {
      pilotInput?.focus();
    }
  });

  pilotClose?.addEventListener('click', () => {
    pilotWindow.style.display = 'none';
  });

  async function sendToSAM() {
    const text = pilotInput.value.trim();
    if (!text) return;
    pilotInput.value = '';

    // Add user message
    pilotMessages.innerHTML += `
      <div style="background: var(--cyan); color: #fff; padding: 12px; border-radius: 12px; font-size: 13px; line-height: 1.5; align-self: flex-end; max-width: 85%;">
        ${text}
      </div>
    `;
    pilotMessages.scrollTop = pilotMessages.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, agent: 'control' })
      });
      const data = await res.json();

      pilotMessages.innerHTML += `
        <div style="background: var(--nav-glass); border: 1px solid var(--stroke); padding: 12px; border-radius: 12px; color: #fff; font-size: 13px; line-height: 1.5; max-width: 85%;">
          ${data.response}
        </div>
      `;
      pilotMessages.scrollTop = pilotMessages.scrollHeight;
    } catch (e) {
      pilotMessages.innerHTML += `<div style="color: var(--bad); font-size: 11px;">Connection error to edge...</div>`;
    }
  }

  pilotSend?.addEventListener('click', sendToSAM);
  pilotInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendToSAM(); });

  const facetimeBtn = document.getElementById('meaux-facetime-invite');
  facetimeBtn?.addEventListener('click', async () => {
    const email = prompt("Enter email to send FaceTime invite to:");
    if (!email) return;

    facetimeBtn.textContent = "Sending...";
    facetimeBtn.disabled = true;

    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: "FaceTime Meeting Invite - Meauxbility Edge",
          html: `
            <div style="font-family: sans-serif; padding: 20px; background: #050713; color: #fff; border-radius: 20px; text-align: center;">
              <h2 style="color: #22D3EE;">FaceTime Invitation</h2>
              <p>You have been invited to a secure FaceTime chat session.</p>
              <div style="margin: 30px 0;">
                <a href="https://facetime.apple.com/join" style="background: #22D3EE; color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 800;">Join FaceTime Chat</a>
              </div>
              <p style="font-size: 12px; color: rgba(255,255,255,0.5);">MeauxMeeting Agent is initialized and ready to take notes.</p>
            </div>
          `
        })
      });

      if (res.ok) {
        alert("FaceTime Invite Sent! (Resend Test Passed)");
        if (window.triggerMeauxPilot) {
          window.triggerMeauxPilot("FaceTime invite transmitted via Resend API. I have activated MeauxMeeting agent to observe the session, take notes, and build a gameplan.");
        }
      } else {
        throw new Error("Failed to send invite");
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      facetimeBtn.textContent = "📲 Send FaceTime Invite (Resend Test)";
      facetimeBtn.disabled = false;
    }
  });

  window.triggerMeauxPilot = (message) => {
    pilotWindow.style.display = 'flex';
    pilotMessages.innerHTML += `
      <div style="background: var(--nav-glass); border: 1px solid var(--stroke); padding: 12px; border-radius: 12px; color: #fff; font-size: 13px; line-height: 1.5; max-width: 85%;">
        <b>[GUIDE ACTIVATED]</b> ${message}
      </div>
    `;
    pilotMessages.scrollTop = pilotMessages.scrollHeight;
  };

  // Realtime connection status simulation
  const statusDot = document.getElementById('meaux-pilot-status');
  if (statusDot) {
    setInterval(() => {
      statusDot.style.opacity = statusDot.style.opacity === '0.5' ? '1' : '0.5';
    }, 1000);
  }

  // Handle nav clicks
  document.querySelectorAll('.nav-item, .mobile-nav-item, .submenu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const route = item.getAttribute('data-route');

      // If it's a parent item with a submenu, toggle it instead of navigating
      if (item.classList.contains('has-submenu')) {
        e.preventDefault();
        const submenu = item.nextElementSibling;
        const isOpen = submenu?.classList.contains('open');

        // Close all other submenus first
        document.querySelectorAll('.nav-submenu').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));

        if (!isOpen && submenu) {
          submenu.classList.add('open');
          item.classList.add('open');
        }
        return;
      }

      if (route && window.router) {
        e.preventDefault();
        window.router.navigate(route);

        // Update active states
        document.querySelectorAll('.nav-item, .mobile-nav-item, .submenu-item').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-route') === route);
        });
      }

      // Close mobile menu on click
      if (window.innerWidth <= 1024) {
        sidenav?.classList.remove('mobile-open');
        mobileOverlay?.classList.remove('active');
        document.getElementById('navToggle')?.classList.remove('active');
      }
    });
  });

  // Toggle Morphing Hamburger
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    if (window.innerWidth <= 1024) {
      sidenav?.classList.toggle('mobile-open');
      mobileOverlay?.classList.toggle('active');
    } else {
      sidenav?.classList.toggle('collapsed');
      localStorage.setItem('nav-collapsed', sidenav?.classList.contains('collapsed'));
    }
  });

  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update toggle icon
    themeToggle.innerHTML = newTheme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  });

  // Restore sidebar state
  if (localStorage.getItem('nav-collapsed') === 'true' && window.innerWidth > 1024) {
    sidenav?.classList.add('collapsed');
    navToggle?.classList.add('active');
  }

  mobileOverlay?.addEventListener('click', () => {
    sidenav?.classList.remove('mobile-open');
    mobileOverlay?.classList.remove('active');
    navToggle?.classList.remove('active');
  });
}

