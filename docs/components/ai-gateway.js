export default function AiGateway() {
  return `
    <style>
      .ai-wrap { padding: 20px; font-family: 'Inter', sans-serif; color:#0f172a; }
      .ai-grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
      .ai-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:14px; box-shadow:0 10px 30px rgba(15,23,42,0.08); }
      .ai-card h3 { margin:0 0 6px; font-size:16px; }
      .ai-meta { color:#64748b; font-size:13px; margin:0 0 10px; }
      .ai-btn { display:inline-block; padding:8px 10px; border-radius:10px; border:1px solid #e2e8f0; background:#0ea5e9; color:white; font-weight:600; text-decoration:none; }
      .ai-list { margin-top:12px; color:#475569; font-size:13px; }
    </style>
    <div class="ai-wrap">
      <h2 style="margin:0 0 8px;">AI Gateway</h2>
      <p style="margin:0 0 14px; color:#475569;">AutoRAG, chat, and knowledge ingestion.</p>
      <div class="ai-grid">
        <div class="ai-card">
          <h3>AutoRAG Chat</h3>
          <p class="ai-meta">Query knowledge base</p>
          <a class="ai-btn" href="/dashboard/chat-lite" data-route="/dashboard/chat-lite">Open Chat</a>
          <div class="ai-list">Uses /api/autorag/query and chat APIs.</div>
        </div>
        <div class="ai-card">
          <h3>Ingest Docs</h3>
          <p class="ai-meta">Upload & vectorize</p>
          <a class="ai-btn" href="/dashboard/upload" data-route="/dashboard/upload">Upload Docs</a>
          <div class="ai-list">Smart upload + ingestion pipelines.</div>
        </div>
        <div class="ai-card">
          <h3>Workflows</h3>
          <p class="ai-meta">Automations & pipelines</p>
          <a class="ai-btn" href="/dashboard/workflows" data-route="/dashboard/workflows">Open Workflows</a>
          <div class="ai-list">Execute stored workflows via API.</div>
        </div>
      </div>
    </div>
  `;
}

export function init() { }
// iAccess AI Gateway Component
let gatewayChart;

export default function AIGateway() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">AI Gateway</h1>
      <p class="page-subtitle">Unified control center for all your AI operations</p>
    </div>
    <div style="padding: 0; max-width: 1600px; margin: 0 auto;">
      <!-- Page Header -->
      <div style="margin-bottom: 32px; display: none;">
        <h1 style="font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          🤖 AI Gateway
        </h1>
        <p style="color: var(--text-secondary); font-size: 1.125rem;">
          Unified control center for all your AI operations
        </p>
      </div>

      <!-- Savings Banner -->
      <div style="background: linear-gradient(135deg, rgba(74, 236, 220, 0.15), rgba(31, 151, 169, 0.1)); border: 2px solid rgba(74, 236, 220, 0.3); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
        <div style="font-size: 4rem; font-weight: 900; background: linear-gradient(135deg, var(--accent), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;">$2,147</div>
        <div style="font-size: 1.25rem; color: var(--text-secondary); margin-top: 8px; font-weight: 600;">Saved This Month via Caching</div>
      </div>

      <!-- Stats Grid -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">Gateway Performance</h2>
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 12px; font-size: 0.875rem; font-weight: 600; background: var(--success-light); color: var(--status-success);">● All Systems Operational</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
          <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 24px; transition: all 0.3s ease; cursor: pointer;">
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Total Requests</div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">142.3K</div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.875rem; font-weight: 600; color: var(--status-success);">↑ +34% from last month</div>
          </div>
          <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 24px; transition: all 0.3s ease; cursor: pointer;">
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Cache Hit Rate</div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">67%</div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.875rem; font-weight: 600; color: var(--status-success);">↑ +12% improvement</div>
          </div>
          <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 24px; transition: all 0.3s ease; cursor: pointer;">
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Avg Latency</div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">247ms</div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.875rem; font-weight: 600; color: var(--status-success);">↓ -23ms faster</div>
          </div>
          <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 24px; transition: all 0.3s ease; cursor: pointer;">
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Cost Savings</div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">$2.1K</div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.875rem; font-weight: 600; color: var(--status-success);">vs. direct API calls</div>
          </div>
        </div>
      </div>

      <!-- Connected Providers -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">Connected AI Providers</h2>
          <button class="btn btn-primary" style="padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 0.9375rem; cursor: pointer; background: var(--primary); color: white; border: none; box-shadow: var(--shadow-sm);">+ Add Provider</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
          ${['OpenAI', 'Anthropic', 'Workers AI', 'Google AI', 'Groq', 'Replicate'].map((provider, i) => `
            <div class="provider-card" data-provider="${provider.toLowerCase()}" style="background: var(--bg-elevated); border: 2px solid ${i < 3 ? 'var(--accent)' : 'var(--border)'}; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s ease; cursor: pointer; position: relative;">
              ${i < 3 ? '<div style="position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: white;">?</div>' : ''}
              <div style="font-size: 2rem; margin-bottom: 12px;">${['??', '??', '??', '??', '?', '??'][i]}</div>
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${provider}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i < 3 ? 'Active � ' + ['89K', '42K', '11K'][i] + ' requests' : 'Not configured'}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Request Volume Chart -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 24px;">Request Volume & Cache Performance</h2>
        <div style="height: 400px; background: var(--bg-elevated); border-radius: 12px; padding: 24px;">
          <canvas id="gatewayChart"></canvas>
        </div>
      </div>

      <!-- Active Features -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">Active Features</h2>
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 12px; font-size: 0.875rem; font-weight: 600; background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; box-shadow: var(--shadow-sm);">PRO PLAN</span>
        </div>
        <ul style="list-style: none; margin: 0; padding: 0;">
          ${[
      { icon: '?', title: 'Smart Caching', desc: 'Automatic response caching with 67% hit rate saving $2.1K/month' },
      { icon: '???', title: 'Rate Limiting', desc: 'Protect against quota exhaustion � 1000 req/min limit' },
      { icon: '??', title: 'Automatic Fallbacks', desc: 'Failover to Anthropic when OpenAI is unavailable � 99.9% uptime' },
      { icon: '??', title: 'Content Guardrails', desc: 'Real-time content moderation on prompts and responses', premium: true },
      { icon: '??', title: 'Advanced Analytics', desc: 'Track usage, costs, and performance across all providers', premium: true },
      { icon: '??', title: 'A/B Testing', desc: 'Compare model performance and optimize for cost/quality', premium: true }
    ].map(feature => `
            <li style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-elevated); border-radius: 8px; margin-bottom: 12px; transition: all 0.2s ease; cursor: pointer;">
              <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem; background: ${feature.premium ? 'linear-gradient(135deg, rgba(31, 151, 169, 0.2), rgba(31, 151, 169, 0.05))' : 'linear-gradient(135deg, rgba(74, 236, 220, 0.2), rgba(74, 236, 220, 0.05))'}; color: ${feature.premium ? 'var(--primary)' : 'var(--accent)'};">
                ${feature.icon}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${feature.title}</div>
                <div style="font-size: 0.875rem; color: var(--text-muted);">${feature.desc}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

export function init() {
  console.log('AI Gateway init');

  // Initialize chart
  const ctx = document.getElementById('gatewayChart');
  if (ctx && typeof Chart !== 'undefined') {
    gatewayChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Total Requests',
          data: [18, 22, 20, 25, 23, 19, 24],
          borderColor: '#1F97A9',
          backgroundColor: 'rgba(31, 151, 169, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Cache Hits',
          data: [12, 15, 13, 17, 15, 13, 16],
          borderColor: '#4AECDC',
          backgroundColor: 'rgba(74, 236, 220, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9CA3AF', font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: '#1A2332',
            titleColor: '#F9FAFB',
            bodyColor: '#9CA3AF',
            borderColor: '#1F97A9',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: { color: '#6B7280' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            ticks: { color: '#6B7280' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }

  // Add hover effects
  document.querySelectorAll('.provider-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
      this.style.borderColor = 'var(--primary)';
      this.style.boxShadow = 'var(--shadow-md)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      const isActive = this.dataset.provider && ['openai', 'anthropic', 'workers ai'].includes(this.dataset.provider);
      this.style.borderColor = isActive ? 'var(--accent)' : 'var(--border)';
      this.style.boxShadow = 'none';
    });
  });
}
