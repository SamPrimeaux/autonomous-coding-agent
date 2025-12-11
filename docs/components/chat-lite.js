// Minimal Chat UI (vanilla JS) polling + Realtime-ready
export default function ChatLite() {
  return `
    <style>
      .chat-root { display: grid; grid-template-columns: 260px 1fr; gap: 12px; height: calc(100vh - 140px); padding: 12px; box-sizing: border-box; font-family: 'Inter', sans-serif; }
      .chat-list { border: 1px solid #e2e8f0; border-radius: 12px; overflow: auto; background: #f8fafc; }
      .chat-item { padding: 10px; border-bottom: 1px solid #e2e8f0; cursor: pointer; }
      .chat-item.active { background: #0ea5e9; color: #0b1020; font-weight: 700; }
      .chat-pane { border: 1px solid #0f172a; border-radius: 12px; display: flex; flex-direction: column; background: #0b1020; box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
      .chat-messages { flex: 1; padding: 12px; overflow: auto; background: linear-gradient(180deg, rgba(15,23,42,0.45), rgba(15,23,42,0.9)); }
      .chat-msg { margin-bottom: 10px; }
      .chat-msg-author { font-weight: 600; font-size: 13px; color: #cbd5e1; }
      .chat-msg-text { font-size: 14px; color: #e2e8f0; line-height: 1.45; }
      .chat-input { display: flex; padding: 10px; gap: 8px; border-top: 1px solid #111827; background: #0f172a; }
      .chat-input input { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #1f2937; background: #0b1020; color: #e2e8f0; }
      .chat-input button { padding: 10px 14px; border-radius: 10px; border: none; background: #0ea5e9; color: #0b1020; cursor: pointer; font-weight: 800; box-shadow: 0 10px 24px rgba(14,165,233,0.35); }
      .chat-msg.assistant { background:#0f172a; border:1px solid rgba(255,255,255,0.08); padding:10px 12px; border-radius:12px; }
      .chat-msg.user { background:#0ea5e9; color:#0b1020; padding:10px 12px; border-radius:12px; margin-left:auto; box-shadow:0 8px 24px rgba(14,165,233,0.35); }
      @media (max-width: 900px) { .chat-root { grid-template-columns: 1fr; height: auto; } }
    </style>
    <div class="chat-root">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px;">
          <h3 style="margin:0; font-size:16px;">Conversations</h3>
          <button id="chat-new" style="padding:6px 8px; border-radius:8px; border:1px solid #e2e8f0; background:#fff;">+ New</button>
        </div>
        <div class="chat-list" id="chat-conversations"></div>
      </div>
      <div class="chat-pane">
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input">
          <input id="chat-input" placeholder="Type a message..." />
          <button id="chat-send">Send</button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  initChatLite();
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  return res.json();
}

async function initChatLite() {
  const convEl = document.getElementById('chat-conversations');
  const msgEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const newBtn = document.getElementById('chat-new');
  if (!convEl) return;

  let conversations = [];
  let activeId = null;

  async function loadConversations() {
    conversations = await fetchJSON('/api/chat/conversations');
    renderConversations();
    if (!activeId && conversations[0]) {
      activeId = conversations[0].id;
    }
    await loadMessages();
  }

  function renderConversations() {
    convEl.innerHTML = '';
    conversations.forEach(c => {
      const item = document.createElement('div');
      item.className = 'chat-item' + (c.id === activeId ? ' active' : '');
      item.textContent = c.title;
      item.onclick = () => { activeId = c.id; renderConversations(); loadMessages(); };
      convEl.appendChild(item);
    });
  }

  async function loadMessages() {
    if (!activeId) { msgEl.innerHTML = '<div style="padding:10px;">Select a conversation</div>'; return; }
    const msgs = await fetchJSON(`/api/chat/messages?conversationId=${encodeURIComponent(activeId)}&limit=50`);
    msgEl.innerHTML = msgs.map(m => `
      <div class="chat-msg">
        <div class="chat-msg-author">${m.author || 'anon'} · ${new Date(m.created_at).toLocaleTimeString()}</div>
        <div class="chat-msg-text">${escapeHtml(m.text || '')}</div>
      </div>
    `).join('');
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  async function sendMessage() {
    if (!activeId) return;
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    await fetchJSON('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: activeId, text, author: 'you' })
    });
    await loadMessages();
  }

  newBtn.onclick = async () => {
    const title = prompt('Conversation title?') || 'Conversation';
    const created = await fetchJSON('/api/chat/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    activeId = created.id;
    await loadConversations();
  };

  sendBtn.onclick = sendMessage;
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  await loadConversations();
  setInterval(loadMessages, 8000);

  // Realtime listener
  connectRealtime('chat', async () => {
    await loadMessages();
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function connectRealtime(channel, onMessage) {
  try {
    const ws = new WebSocket(`${location.origin.replace('http', 'ws')}/api/realtime`);
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'subscribe', channel }));
    });
    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.channel === channel || data.channel === 'all') {
          onMessage && onMessage(data);
        }
      } catch (e) { /* ignore */ }
    });
    ws.addEventListener('error', () => ws.close());
    ws.addEventListener('close', () => setTimeout(() => connectRealtime(channel, onMessage), 2000));
  } catch (e) {
    console.warn('realtime connect failed', e);
  }
}
