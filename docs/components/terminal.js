// Multi-Agent Hub - Relocated to Terminal Page
export default function Terminal() {
  return `
    <style>
      .agent-terminal {
        padding: 2rem;
        animation: fadeIn 0.5s ease;
      }

      .terminal-header {
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .agent-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
      }

      @media (max-width: 768px) {
        .agent-grid { grid-template-columns: 1fr; }
      }

      .agent-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 24px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        box-shadow: var(--shadow-md);
        transition: var(--transition);
      }

      .agent-card:hover {
        border-color: var(--meaux-cyan);
        transform: translateY(-5px);
      }

      .agent-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .agent-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 700;
        font-size: 1.1rem;
        color: #fff;
      }

      .agent-icon-box {
        width: 36px;
        height: 36px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--meaux-cyan);
      }

      .browser-mock {
        background: #000;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.05);
        height: 260px;
        display: flex;
        flex-direction: column;
      }

      .browser-bar {
        background: rgba(255,255,255,0.03);
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        gap: 0.5rem;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }

      .dot { width: 8px; height: 8px; border-radius: 50%; background: #333; }

      .browser-url-bar {
        flex: 1;
        background: rgba(0,0,0,0.4);
        height: 20px;
        border-radius: 4px;
        font-size: 10px;
        color: #666;
        display: flex;
        align-items: center;
        padding: 0 0.5rem;
      }

      .browser-content {
        flex: 1;
        padding: 1.25rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        line-height: 1.5;
        overflow-y: auto;
        color: var(--meaux-cyan);
      }

      .agent-input-box {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 0.5rem;
      }

      .agent-input-field {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        padding: 0.5rem;
        font-size: 0.9rem;
        outline: none;
      }

      .agent-send-btn {
        width: 32px;
        height: 32px;
        background: var(--meaux-cyan);
        border: none;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        cursor: pointer;
        transition: var(--transition);
      }

      .agent-send-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
      }
    </style>

    <div class="agent-terminal">
      <div class="terminal-header">
        <div>
          <h1 style="font-size: 2rem; font-weight: 800; color: #fff;">Agent Orchestration</h1>
          <p style="color: var(--text-muted);">Coordinate multi-agent clusters across intelligent infrastructure.</p>
        </div>
        <select class="select" id="terminal-agent-select">
          <option value="all">Unified Cluster</option>
          <option value="control">MeauxControlPilot</option>
          <option value="builder">MeauxBuilder</option>
          <option value="research">MeauxResearch</option>
        </select>
      </div>

      <div class="agent-grid">
        ${agentCard('MeauxControlPilot', 'control', 'System infrastructure & logic')}
        ${agentCard('MeauxBuilder', 'builder', 'Fullstack generation & deployment')}
        ${agentCard('MeauxResearch', 'research', 'Deep analysis & edge intelligence')}
        ${agentCard('MeauxDesigner', 'designer', 'Refined UI/UX & asset orchestration')}
      </div>
    </div>
  `;
}

function agentCard(name, id, meta) {
  const icons = {
    control: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    builder: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.7a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.7z"/></svg>',
    research: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    designer: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l7.5 14.5L13 18l5-5z"/><path d="M2 2l5 5"/></svg>'
  };

  return `
    <div class="agent-card" data-agent="${id}">
      <div class="agent-title-row">
        <div class="agent-title">
          <div class="agent-icon-box">${icons[id] || icons.control}</div>
          ${name}
        </div>
        <div class="status-badge" style="padding: 0.25rem 0.75rem; font-size: 0.7rem;">
          <span class="status-dot" style="width: 6px; height: 6px;"></span>
          Cluster Sync
        </div>
      </div>
      
      <div style="font-size: 0.85rem; color: var(--text-muted);">${meta}</div>

      <div class="browser-mock">
        <div class="browser-bar">
          <div class="dot"></div><div class="dot"></div><div class="dot"></div>
          <div class="browser-url-bar">meauxos://cluster/${id}/output</div>
        </div>
        <div class="browser-content" id="output-${id}">
          > Initializing cluster node...<br>
          > Establishing neural handshake...<br>
          > Node ${id} online and synchronized.
        </div>
      </div>

      <div class="agent-input-box">
        <input type="text" class="agent-input-field" id="input-${id}" placeholder="Dispatch command to ${name}..."/>
        <button class="agent-send-btn" onclick="window.dispatchToAgent('${id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

export function init() {
  window.dispatchToAgent = async (agentId) => {
    const input = document.getElementById(`input-${agentId}`);
    const output = document.getElementById(`output-${agentId}`);
    if (!input || !input.value.trim() || !output) return;

    const cmd = input.value.trim();
    input.value = '';
    output.innerHTML += `<br><span style="color:#fff;">$ ${cmd}</span><br>> Processing...`;
    output.scrollTop = output.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cmd, agent: agentId })
      });
      const data = await res.json();
      output.innerHTML += `<br><span style="color:var(--meaux-cyan);">${data.response}</span>`;
      output.scrollTop = output.scrollHeight;
    } catch (e) {
      output.innerHTML += `<br><span style="color:#ef4444;">! Synchronization error</span>`;
    }
  };
}
