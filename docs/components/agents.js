export default function Agents() {
  return `
    <div style="padding: 24px 16px 80px; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
          AI Agents
        </h1>
        <p style="font-size: 16px; color: var(--text-secondary);">
          Multi-agent collaboration system
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
        ${['Design', 'Dev', 'Terminal', 'Vision'].map((agent, idx) => `
          <div class="agent-card" data-agent-id="agent-${idx + 1}" style="
            background: white;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            height: 600px;
          ">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: linear-gradient(135deg, var(--primary), var(--primary-light));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 20px;
              ">${agent.charAt(0)}</div>
              <div>
                <h3 style="font-size: 18px; font-weight: 600; margin: 0;">Agent ${String.fromCharCode(65 + idx)}: ${agent}</h3>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">AI Assistant</p>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">MCP</button>
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">Terminal</button>
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">Dev</button>
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">Preview</button>
            </div>

            <div class="agent-messages" style="
              flex: 1;
              overflow-y: auto;
              background: var(--bg);
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 16px;
              font-size: 13px;
              line-height: 1.6;
            ">
              <div style="color: var(--text-secondary); text-align: center; padding: 20px;">
                No messages yet. Start a conversation below.
              </div>
            </div>

            <div style="margin-bottom: 12px;">
              <select class="agent-target" style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border);
                border-radius: 8px;
                font-size: 13px;
                font-family: inherit;
                margin-bottom: 8px;
              ">
                <option>Send to Dev</option>
                <option>Send to Runtime</option>
                <option>Send to Terminal</option>
              </select>
            </div>

            <div style="display: flex; gap: 8px;">
              <textarea 
                class="agent-input" 
                placeholder="Enter your prompt..." 
                rows="2"
                style="
                  flex: 1;
                  padding: 12px;
                  border: 1px solid var(--border);
                  border-radius: 8px;
                  font-family: inherit;
                  font-size: 13px;
                  resize: none;
                "
              ></textarea>
              <button class="btn btn-primary agent-send" style="min-width: 60px; padding: 12px;">
                Send
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function init() {
  document.querySelectorAll('.agent-send').forEach(btn => {
    btn.addEventListener('click', async function () {
      const card = this.closest('.agent-card');
      const agentId = card.dataset.agentId;
      const input = card.querySelector('.agent-input');
      const target = card.querySelector('.agent-target').value;
      const message = input.value.trim();

      if (!message) return;

      // Add user message to chat
      const messagesDiv = card.querySelector('.agent-messages');
      if (messagesDiv.querySelector('div').textContent.includes('No messages')) {
        messagesDiv.innerHTML = '';
      }

      messagesDiv.innerHTML += `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; margin-bottom: 4px; color: var(--primary);">You</div>
          <div style="background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">${message}</div>
        </div>
      `;

      input.value = '';
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      // Send to API
      try {
        const response = await fetch(`/api/agents/${agentId}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, target })
        });
        const data = await response.json();

        // Add agent response
        messagesDiv.innerHTML += `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-secondary);">Agent</div>
            <div style="background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">${data.response || 'Message received and processed.'}</div>
          </div>
        `;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    });
  });

  // Enter key to send
  document.querySelectorAll('.agent-input').forEach(input => {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.closest('.agent-card').querySelector('.agent-send').click();
      }
    });
  });
}
