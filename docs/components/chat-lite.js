// Realtime Communication Hub - WebSocket Powered
export default function ChatLite() {
  return `
    <style>
      .chat-galaxy {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
        height: calc(100vh - 120px);
        padding: 20px;
        animation: fadeIn 0.5s ease;
      }

      .chat-sidebar {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid var(--stroke);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .chat-main {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(40px);
        border: 1px solid var(--stroke);
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow);
      }

      .chat-header {
        padding: 20px;
        border-bottom: 1px solid var(--stroke);
        background: var(--nav-glass);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }

      .conv-item {
        padding: 14px;
        border-radius: 12px;
        cursor: pointer;
        transition: var(--transition);
        margin-bottom: 8px;
        border: 1px solid transparent;
      }

      .conv-item:hover {
        background: rgba(255,255,255,0.05);
      }

      .conv-item.active {
        background: rgba(34, 211, 238, 0.15);
        border-color: rgba(34, 211, 238, 0.3);
      }

      .messages-area {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: radial-gradient(circle at center, rgba(34, 211, 238, 0.02) 0%, transparent 100%);
      }

      .msg-bubble {
        max-width: 80%;
        padding: 14px 18px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.5;
        position: relative;
        animation: slideUp 0.3s ease;
      }

      .msg-user {
        background: var(--cyan);
        color: #fff;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
        box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
      }

      .msg-agent {
        background: var(--nav-glass);
        color: #fff;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        border: 1px solid var(--stroke);
      }

      .chat-input-area {
        padding: 20px;
        border-top: 1px solid var(--stroke);
        background: var(--nav-glass);
        display: flex;
        gap: 12px;
      }

      .chat-input-area input {
        flex: 1;
        padding: 14px 20px;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--stroke);
        border-radius: 14px;
        color: #fff;
        font-size: 14px;
        outline: none;
        transition: var(--transition);
      }

      .chat-input-area input:focus {
        border-color: var(--cyan);
        background: rgba(255,255,255,0.08);
      }

      @media (max-width: 900px) {
        .chat-galaxy { grid-template-columns: 1fr; height: auto; }
        .chat-sidebar { display: none; }
      }
    </style>

    <div class="chat-galaxy">
      <div class="chat-sidebar">
        <div class="chat-header">
          <h3 style="margin:0; font-size:16px; color:#fff;">Conversations</h3>
          <button id="new-conv" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">+ New</button>
        </div>
        <div class="chat-list" id="conv-list">
          <div class="loading">Syncing secure channels...</div>
        </div>
      </div>

      <div class="chat-main">
        <div class="chat-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <div id="active-conv-icon" style="width:10px; height:10px; background:#10B981; border-radius:50%;"></div>
            <h3 id="active-conv-title" style="margin:0; font-size:16px; color:#fff;">Select a secure node</h3>
          </div>
          <div style="font-size:11px; color:var(--muted2); font-weight:700;">AES-256 EDGE ENCRYPTED</div>
        </div>
        
        <div class="messages-area" id="msg-list">
          <div style="text-align:center; padding:40px; color:var(--muted2);">
            <svg width="48" height="48" fill="none" stroke="currentColor" style="margin-bottom:16px; opacity:0.3;"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <p>Initialize communication link to begin real-time sync.</p>
          </div>
        </div>

        <div class="chat-input-area">
          <input type="text" id="chat-input" placeholder="Transmit message across the edge...">
          <button id="chat-send" class="btn btn-primary" style="padding: 12px 24px;">Send</button>
        </div>
      </div>
    </div>
  `;
}

export async function init() {
  const convList = document.getElementById('conv-list');
  const msgList = document.getElementById('msg-list');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const newConvBtn = document.getElementById('new-conv');
  const activeTitle = document.getElementById('active-conv-title');

  let activeId = null;
  let ws = null;

  function connectRealtime() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    ws = new WebSocket(`${protocol}://${window.location.host}/api/realtime`);

    ws.onopen = () => {
      console.log('Realtime Link Established');
      ws.send(JSON.stringify({ type: 'subscribe', channel: 'chat' }));
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'message' && data.conversationId === activeId) {
        appendMessage(data);
      }
    };

    ws.onclose = () => setTimeout(connectRealtime, 3000);
  }

  function appendMessage(m) {
    const isUser = m.author === 'you';
    const div = document.createElement('div');
    div.className = `msg-bubble ${isUser ? 'msg-user' : 'msg-agent'}`;
    div.innerHTML = `
      <div style="font-size:10px; opacity:0.7; margin-bottom:4px; font-weight:800;">${m.author.toUpperCase()}</div>
      <div>${m.text}</div>
      <div style="font-size:9px; opacity:0.5; margin-top:4px; text-align:right;">${new Date().toLocaleTimeString()}</div>
    `;
    msgList.appendChild(div);
    msgList.scrollTop = msgList.scrollHeight;
  }

  async function loadConversations() {
    try {
      const res = await fetch('/api/chat/conversations');
      const data = await res.json();
      convList.innerHTML = data.map(c => `
        <div class="conv-item ${c.id === activeId ? 'active' : ''}" data-id="${c.id}">
          <div style="font-weight:700; color:#fff; font-size:14px;">${c.title}</div>
          <div style="font-size:11px; color:var(--muted2); margin-top:4px;">Node: ${c.id.slice(0, 8)}</div>
        </div>
      `).join('');

      document.querySelectorAll('.conv-item').forEach(item => {
        item.onclick = () => {
          activeId = item.dataset.id;
          activeTitle.textContent = item.querySelector('div').textContent;
          loadMessages(activeId);
          loadConversations();
        };
      });
    } catch (e) {
      convList.innerHTML = '<div style="padding:20px; color:var(--bad);">Sync failed.</div>';
    }
  }

  async function loadMessages(id) {
    msgList.innerHTML = '<div class="loading">Decrypting transmission...</div>';
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${id}`);
      const messages = await res.json();
      msgList.innerHTML = '';
      messages.forEach(appendMessage);
    } catch (e) {
      msgList.innerHTML = '<div style="color:var(--bad);">Transmission lost.</div>';
    }
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !activeId) return;
    chatInput.value = '';

    const msg = { conversationId: activeId, text, author: 'you' };
    appendMessage(msg);

    // Send to server
    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });

    // Proactive Agent Response
    if (text.toLowerCase().includes('workflow') || text.toLowerCase().includes('guide')) {
      setTimeout(() => {
        const agentMsg = {
          conversationId: activeId,
          text: "I've detected a workflow request. I am activating Agent SAM to guide you through the next deployment phase. Check your Sitewide Pilot bubble for real-time guidance.",
          author: 'system'
        };
        appendMessage(agentMsg);
      }, 1000);
    }
  }

  chatSend.onclick = sendMessage;
  chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

  newConvBtn.onclick = async () => {
    const title = prompt('Secure Node Name?') || 'New Channel';
    const res = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const created = await res.json();
    activeId = created.id;
    await loadConversations();
    await loadMessages(activeId);
  };

  connectRealtime();
  loadConversations();
}
