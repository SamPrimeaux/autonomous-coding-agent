// Cosmic Agents Dashboard Component
export default function Agents() {
  const agents = [
    {
      id: 'browse',
      name: 'MeauxBrowse Agent',
      status: 'active',
      url: 'https://browse.meaux.ai',
      description: 'Autonomous web browsing and research agent',
      badges: [
        { label: 'Gemini 2.0', variant: 'cyan' },
        { label: 'Cloudflare AI', variant: 'purple' },
        { label: 'Vision', variant: 'default' },
      ],
      placeholder: 'Search the web for...',
    },
    {
      id: 'code',
      name: 'MeauxCode Agent',
      status: 'active',
      url: 'https://code.meaux.ai',
      description: 'Code generation and repository analysis',
      badges: [
        { label: 'Claude 3.5', variant: 'purple' },
        { label: 'GitHub API', variant: 'default' },
        { label: 'Multi-file', variant: 'cyan' },
      ],
      placeholder: 'Generate code for...',
    },
    {
      id: 'data',
      name: 'MeauxData Agent',
      status: 'idle',
      url: 'https://data.meaux.ai',
      description: 'Data extraction and transformation pipeline',
      badges: [
        { label: 'Workers AI', variant: 'cyan' },
        { label: 'R2 Storage', variant: 'default' },
        { label: 'D1 Database', variant: 'default' },
      ],
      placeholder: 'Process data from...',
    },
    {
      id: 'docs',
      name: 'MeauxDocs Agent',
      status: 'active',
      url: 'https://docs.meaux.ai',
      description: 'Document analysis and summarization',
      badges: [
        { label: 'GPT-4o', variant: 'purple' },
        { label: 'PDF Parser', variant: 'default' },
        { label: 'RAG', variant: 'cyan' },
      ],
      placeholder: 'Analyze document...',
    },
    {
      id: 'flow',
      name: 'MeauxFlow Agent',
      status: 'active',
      url: 'https://flow.meaux.ai',
      description: 'Workflow automation and orchestration',
      badges: [
        { label: 'Durable Objects', variant: 'cyan' },
        { label: 'Queues', variant: 'default' },
        { label: 'Cron', variant: 'default' },
      ],
      placeholder: 'Create workflow for...',
    },
    {
      id: 'chat',
      name: 'MeauxChat Agent',
      status: 'offline',
      url: 'https://chat.meaux.ai',
      description: 'Multi-modal conversation interface',
      badges: [
        { label: 'Llama 3.2', variant: 'purple' },
        { label: 'Voice', variant: 'default' },
        { label: 'Memory', variant: 'cyan' },
      ],
      placeholder: 'Start conversation...',
    },
  ];

  function getBadgeHtml(badge) {
    const variants = {
      default: 'background: rgba(255,255,255,0.05); border: 1px solid transparent; color: var(--muted);',
      cyan: 'background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.3); color: var(--color-neon-cyan);',
      purple: 'background: rgba(189, 0, 255, 0.1); border: 1px solid rgba(189, 0, 255, 0.3); color: var(--color-neon-purple);'
    };
    const style = variants[badge.variant] || variants.default;
    return `<span style="padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; white-space: nowrap; ${style}">${badge.label}</span>`;
  }

  return `
    <div style="padding: 40px 32px 100px; max-width: 1400px; margin: 0 auto;">
      <header style="margin-bottom: 48px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #fff; letter-spacing: -0.03em;">Agent Command Center</h1>
          <div style="color: var(--color-neon-cyan); filter: drop-shadow(0 0 10px var(--color-neon-cyan));">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/></svg>
          </div>
        </div>
        <p style="font-size: 16px; color: var(--muted); max-width: 600px; line-height: 1.6;">
          Deploy, monitor, and interact with your AI agents. Each agent is ready to execute tasks across your industrial edge cluster.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px;">
        ${agents.map(agent => `
          <div class="agent-card" data-agent-id="${agent.id}" style="
            background: var(--color-glass-surface);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid var(--stroke);
            padding: 24px;
            transition: var(--transition);
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: relative;
          ">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em;">${agent.name}</h3>
                <p style="margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5;">${agent.description}</p>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(255,255,255,0.03); border-radius: 100px; border: 1px solid var(--stroke);">
                  <div style="width: 8px; height: 8px; border-radius: 50%; background: ${agent.status === 'active' ? 'var(--color-neon-green)' : agent.status === 'idle' ? 'var(--color-neon-cyan)' : 'var(--muted)'}; box-shadow: ${agent.status === 'active' ? 'var(--shadow-neon-green)' : 'none'}; animation: ${agent.status === 'active' ? 'pulse 2s infinite' : 'none'};"></div>
                  <span style="font-size: 10px; color: var(--muted); font-weight: 700; text-transform: uppercase;">${agent.status}</span>
                </div>
                <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(189, 0, 255, 0.1)); border: 1px solid var(--stroke); display: flex; align-items: center; justify-content: center; color: var(--color-neon-cyan);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                </div>
              </div>
            </div>

            <!-- Browser Window -->
            <div style="border-radius: 12px; overflow: hidden; border: 1px solid var(--stroke); background: #000;">
              <div style="padding: 8px 16px; background: #0f172a; border-bottom: 1px solid var(--stroke); display: flex; align-items: center; gap: 12px;">
                <div style="display: flex; gap: 6px;">
                  <div style="width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></div>
                  <div style="width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></div>
                  <div style="width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></div>
                </div>
                <div style="flex: 1; padding: 4px 12px; background: rgba(255,255,255,0.05); border-radius: 6px; border: 1px solid var(--stroke); font-family: monospace; font-size: 10px; color: var(--muted);">${agent.url}</div>
              </div>
              <div style="height: 120px; background: linear-gradient(135deg, #050511 0%, #1A1A40 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div style="position: absolute; inset: 0; background-image: linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px); background-size: 20px 20px;"></div>
                <div class="agent-terminal-output" style="position: relative; z-index: 1; font-family: monospace; font-size: 11px; color: var(--color-neon-cyan); opacity: 0.8;">
                  ${agent.status === 'active' ? '> CLUSTER SYNC ACTIVE' : '> STANDBY MODE'}
                </div>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${agent.badges.map(b => getBadgeHtml(b)).join('')}
            </div>

            <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--stroke); display: flex; gap: 12px;">
              <input type="text" class="agent-input" placeholder="${agent.placeholder}" style="flex: 1; background: transparent; border: none; border-bottom: 1px solid var(--stroke); padding: 8px 0; color: #fff; font-size: 14px; outline: none;">
              <button class="agent-send" style="width: 40px; height: 40px; border-radius: 10px; background: var(--gradient-neon-cyan); border: none; color: #050511; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
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
      const terminal = card.querySelector('.agent-terminal-output');
      const message = input.value.trim();

      if (!message) return;

      const originalText = terminal.innerHTML;
      terminal.innerHTML = `> PROCESSING: ${message.toUpperCase()}`;
      input.value = '';
      this.disabled = true;
      this.style.opacity = '0.5';

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, agent: agentId })
        });
        const data = await response.json();
        terminal.innerHTML = `> RESPONSE: ${data.response.substring(0, 40)}...`;
        setTimeout(() => { terminal.innerHTML = `> IDLE: READY FOR TASK`; }, 3000);
      } catch (e) {
        terminal.innerHTML = `> ERROR: CONNECTION LOST`;
        setTimeout(() => { terminal.innerHTML = originalText; }, 3000);
      } finally {
        this.disabled = false;
        this.style.opacity = '1';
      }
    });
  });

  document.querySelectorAll('.agent-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.parentElement.querySelector('.agent-send').click();
      }
    });
  });
}
