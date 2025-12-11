// Cloudflare-Native Web Terminal Component
export default function Terminal() {
  return `
    <div class="terminal-container">
      <div class="terminal-header">
        <h2>Cloudflare Terminal</h2>
        <div class="terminal-actions">
          <button class="btn-sm btn-secondary" id="new-terminal-btn">New Session</button>
          <button class="btn-sm btn-secondary" id="clear-terminal-btn">Clear</button>
        </div>
      </div>
      <div id="terminal" class="terminal"></div>
      <div class="terminal-footer">
        <span class="terminal-status" id="terminal-status">Disconnected</span>
        <span class="terminal-session" id="terminal-session">No session</span>
      </div>
    </div>
  `;
}

export function init() {
  // Load xterm.js from CDN if not already loaded
  if (!window.Terminal) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.js';
    script.onload = () => {
      const addonScript = document.createElement('script');
      addonScript.src = 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js';
      addonScript.onload = () => {
        const websocketScript = document.createElement('script');
        websocketScript.src = 'https://cdn.jsdelivr.net/npm/xterm-addon-attach@0.10.0/lib/xterm-addon-attach.js';
        websocketScript.onload = initTerminal;
        document.head.appendChild(websocketScript);
      };
      document.head.appendChild(addonScript);
    };
    document.head.appendChild(script);
  } else {
    initTerminal();
  }
}

function initTerminal() {
  const terminalElement = document.getElementById('terminal');
  if (!terminalElement) return;

  const terminal = new window.Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    theme: {
      background: '#1e293b',
      foreground: '#e2e8f0',
      cursor: '#60a5fa',
      selection: '#334155'
    }
  });

  terminal.open(terminalElement);

  const fitAddon = new window.FitAddon.FitAddon();
  terminal.loadAddon(fitAddon);
  fitAddon.fit();

  // Connect to WebSocket
  let ws = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/terminal/ws`;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        reconnectAttempts = 0;
        updateStatus('Connected', 'active');
        terminal.writeln('\\r\\n\\x1b[32mConnected to Cloudflare Terminal\\x1b[0m\\r\\n');

        // Attach WebSocket to terminal
        const attachAddon = new window.AttachAddon.AttachAddon(ws);
        terminal.loadAddon(attachAddon);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateStatus('Connection Error', 'error');
      };

      ws.onclose = () => {
        updateStatus('Disconnected', 'inactive');
        terminal.writeln('\\r\\n\\x1b[31mConnection closed\\x1b[0m\\r\\n');

        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(() => {
            terminal.writeln(`\\r\\n\\x1b[33mReconnecting... (${reconnectAttempts}/${maxReconnectAttempts})\\x1b[0m\\r\\n`);
            connect();
          }, 2000);
        }
      };

      // Handle terminal input
      terminal.onData((data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'input', data }));
        }
      });

    } catch (error) {
      console.error('Failed to connect:', error);
      terminal.writeln('\\r\\n\\x1b[31mFailed to connect to terminal server\\x1b[0m\\r\\n');
      updateStatus('Connection Failed', 'error');
    }
  }

  function updateStatus(status, className) {
    const statusEl = document.getElementById('terminal-status');
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.className = `terminal-status ${className}`;
    }
  }

  // New session button
  document.getElementById('new-terminal-btn')?.addEventListener('click', () => {
    if (ws) ws.close();
    terminal.clear();
    connect();
  });

  // Clear button
  document.getElementById('clear-terminal-btn')?.addEventListener('click', () => {
    terminal.clear();
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    fitAddon.fit();
  });

  // Initial connection
  connect();
}
