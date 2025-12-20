// Analytics Dashboard - Token usage, costs, and project metrics
export default function Analytics() {
  return `
    <style>
      .analytics-container {
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
      }
      
      .analytics-header {
        margin-bottom: 32px;
      }
      
      .analytics-header h1 {
        font-size: 32px;
        font-weight: 800;
        color: var(--text);
        margin-bottom: 8px;
      }
      
      .analytics-subtitle {
        color: var(--text-secondary);
        font-size: 14px;
      }
      
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }
      
      .metric-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
      }
      
      .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }
      
      .metric-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }
      
      .metric-value {
        font-size: 36px;
        font-weight: 800;
        color: var(--primary);
        margin-bottom: 8px;
        font-variant-numeric: tabular-nums;
      }
      
      .metric-change {
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .metric-change.positive {
        color: #10b981;
      }
      
      .metric-change.negative {
        color: #ef4444;
      }
      
      .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 32px;
      }
      
      @media (max-width: 1200px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .chart-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .chart-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--text);
      }
      
      .chart-period {
        display: flex;
        gap: 8px;
      }
      
      .period-btn {
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid var(--border);
        background: var(--bg-primary);
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      
      .period-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }
      
      .chart-content {
        min-height: 300px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .bar-chart {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .bar-item {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .bar-label {
        min-width: 120px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
      }
      
      .bar-track {
        flex: 1;
        height: 32px;
        background: var(--bg-secondary);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
      }
      
      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #14b8a6, #0891b2);
        border-radius: 8px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        padding: 0 12px;
        color: white;
        font-size: 13px;
        font-weight: 700;
      }
      
      .table-wrapper {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow-x: auto;
      }
      
      .table-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 16px;
      }
      
      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
      }
      
      thead {
        background: var(--bg-secondary);
      }
      
      th {
        padding: 12px 16px;
        text-align: left;
        font-size: 13px;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid var(--border);
      }
      
      th:first-child {
        border-radius: 8px 0 0 0;
      }
      
      th:last-child {
        border-radius: 0 8px 0 0;
      }
      
      tbody tr {
        border-bottom: 1px solid var(--border);
        transition: background 0.15s ease;
      }
      
      tbody tr:hover {
        background: var(--bg-secondary);
      }
      
      tbody tr:last-child {
        border-bottom: none;
      }
      
      td {
        padding: 14px 16px;
        font-size: 14px;
        color: var(--text);
      }
      
      .model-badge {
        display: inline-block;
        padding: 4px 10px;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
      }
      
      .cost-cell {
        font-weight: 700;
        color: #10b981;
      }
      
      .tokens-cell {
        font-variant-numeric: tabular-nums;
        color: var(--text-secondary);
      }
      
      .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        color: var(--text-secondary);
      }
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
    
    <div class="analytics-container">
      <div class="analytics-header">
        <h1>?? Analytics & Costs</h1>
        <p class="analytics-subtitle">Track AI token usage, project costs, and spending trends</p>
      </div>
      
      <div class="metrics-grid" id="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Total Spent (30d)</div>
          <div class="metric-value" id="total-cost">$0.00</div>
          <div class="metric-change positive">
            <span>?</span>
            <span id="cost-change">+0%</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Tokens Used</div>
          <div class="metric-value" id="total-tokens">0</div>
          <div class="metric-change">
            <span id="tokens-change">Last 30 days</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Conversion Credits</div>
          <div class="metric-value" id="cc-credits">631</div>
          <div class="metric-change positive">
            <span id="cc-status">Available</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Avg Cost/Request</div>
          <div class="metric-value" id="avg-cost">$0.000</div>
          <div class="metric-change">
            <span id="efficiency">Efficiency</span>
          </div>
        </div>
      </div>

      <div class="charts-grid" id="cc-section" style="display: none; grid-template-columns: 1fr; margin-bottom: 32px;">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">?? CloudConvert Orchestration</div>
          </div>
          <div id="cc-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <!-- CC stats will load here -->
          </div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">Costs by Project</div>
            <div class="chart-period">
              <button class="period-btn active" data-period="7" data-chart="costs">7d</button>
              <button class="period-btn" data-period="30" data-chart="costs">30d</button>
              <button class="period-btn" data-period="90" data-chart="costs">90d</button>
            </div>
          </div>
          <div class="chart-content" id="costs-chart">
            <div class="loading-state"><div class="spinner"></div></div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">Tokens by Agent</div>
            <div class="chart-period">
              <button class="period-btn active" data-period="7" data-chart="agents">7d</button>
              <button class="period-btn" data-period="30" data-chart="agents">30d</button>
              <button class="period-btn" data-period="90" data-chart="agents">90d</button>
            </div>
          </div>
          <div class="chart-content" id="agents-chart">
            <div class="loading-state"><div class="spinner"></div></div>
          </div>
        </div>
      </div>
      
      <div class="table-wrapper">
        <div class="table-title">Recent AI Usage</div>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              <th>Tokens</th>
              <th>Requests</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody id="usage-table">
            <tr><td colspan="5" style="text-align: center; padding: 40px;">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function init() {
  console.log('?? Analytics dashboard initialized');

  loadMetrics();
  loadCostsChart(30);
  loadAgentsChart(30);
  loadUsageTable(30);
  loadCloudConvertStats();

  // Period button handlers
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const chart = this.dataset.chart;
      const period = parseInt(this.dataset.period);

      // Update active state
      document.querySelectorAll(`[data-chart="${chart}"]`).forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Reload data
      if (chart === 'costs') {
        loadCostsChart(period);
      } else if (chart === 'agents') {
        loadAgentsChart(period);
      }
    });
  });

  async function loadMetrics() {
    try {
      const [projects, tokens] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/analytics/tokens?period=30').then(r => r.json())
      ]);

      if (projects.success) {
        document.getElementById('active-projects').textContent = projects.projects?.length || 0;

        const totalCost = projects.projects?.reduce((sum, p) => sum + (p.total_cost || 0), 0) || 0;
        document.getElementById('total-cost').textContent = '$' + totalCost.toFixed(2);
      }

      if (tokens.success && tokens.byModel) {
        const totalTokens = tokens.byModel.reduce((sum, m) => sum + (m.tokens || 0), 0);
        const totalRequests = tokens.byModel.reduce((sum, m) => sum + (m.requests || 0), 0);
        const totalCost = tokens.byModel.reduce((sum, m) => sum + (m.cost || 0), 0);

        document.getElementById('total-tokens').textContent = formatNumber(totalTokens);
        document.getElementById('avg-cost').textContent = totalRequests > 0
          ? '$' + (totalCost / totalRequests).toFixed(4)
          : '$0.000';
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  }

  async function loadCostsChart(period) {
    const container = document.getElementById('costs-chart');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

    try {
      const response = await fetch(`/api/analytics/costs?period=${period}&groupBy=project`);
      const data = await response.json();

      if (data.success && data.costs) {
        if (data.costs.length === 0) {
          container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No data yet</div>';
          return;
        }

        const maxCost = Math.max(...data.costs.map(c => c.total_cost || 0));

        container.innerHTML = '<div class="bar-chart">' + data.costs.map(cost => {
          const width = maxCost > 0 ? (cost.total_cost / maxCost) * 100 : 0;
          return `
            <div class="bar-item">
              <div class="bar-label">${cost.label || 'Unknown'}</div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${width}%">$${cost.total_cost.toFixed(2)}</div>
              </div>
            </div>
          `;
        }).join('') + '</div>';
      }
    } catch (err) {
      console.error('Failed to load costs chart:', err);
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Failed to load</div>';
    }
  }

  async function loadAgentsChart(period) {
    const container = document.getElementById('agents-chart');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

    try {
      const response = await fetch(`/api/analytics/costs?period=${period}&groupBy=agent`);
      const data = await response.json();

      if (data.success && data.costs) {
        if (data.costs.length === 0) {
          container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No data yet</div>';
          return;
        }

        const maxTokens = Math.max(...data.costs.map(c => c.total_tokens || 0));

        container.innerHTML = '<div class="bar-chart">' + data.costs.map(cost => {
          const width = maxTokens > 0 ? (cost.total_tokens / maxTokens) * 100 : 0;
          const label = cost.label || 'default';
          return `
            <div class="bar-item">
              <div class="bar-label">${label}</div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${width}%">${formatNumber(cost.total_tokens)} tokens</div>
              </div>
            </div>
          `;
        }).join('') + '</div>';
      }
    } catch (err) {
      console.error('Failed to load agents chart:', err);
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Failed to load</div>';
    }
  }

  async function loadUsageTable(period) {
    const tbody = document.getElementById('usage-table');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">Loading...</td></tr>';

    try {
      const response = await fetch(`/api/analytics/tokens?period=${period}`);
      const data = await response.json();

      if (data.success && data.byModel) {
        if (data.byModel.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">No usage data yet</td></tr>';
          return;
        }

        tbody.innerHTML = data.byModel.map(row => `
          <tr>
            <td><span class="model-badge">${row.model}</span></td>
            <td>${row.provider}</td>
            <td class="tokens-cell">${formatNumber(row.tokens)}</td>
            <td>${row.requests}</td>
            <td class="cost-cell">$${row.cost.toFixed(4)}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load usage table:', err);
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">Failed to load</td></tr>';
    }
  }

  async function loadCloudConvertStats() {
    try {
      const res = await fetch('/api/analytics/cloudconvert');
      const data = await res.json();

      if (data.success) {
        const ccSection = document.getElementById('cc-section');
        const statsGrid = document.getElementById('cc-stats-grid');
        const ccCredits = document.getElementById('cc-credits');

        ccSection.style.display = 'grid';

        if (data.account) {
          ccCredits.textContent = data.account.credits || '0';
        }

        const stats = data.dbStats || [];
        const successCount = stats.find(s => s.status === 'completed')?.count || 0;
        const failedCount = stats.find(s => s.status === 'error' || s.status === 'failed')?.count || 0;
        const runningCount = stats.find(s => s.status === 'running')?.count || 0;

        statsGrid.innerHTML = `
          <div style="padding: 16px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2);">
            <div style="font-size: 12px; color: #10b981; font-weight: 700;">SUCCESSFUL</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff;">${successCount}</div>
          </div>
          <div style="padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
            <div style="font-size: 12px; color: #ef4444; font-weight: 700;">FAILED</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff;">${failedCount}</div>
          </div>
          <div style="padding: 16px; background: rgba(34, 211, 238, 0.1); border-radius: 12px; border: 1px solid rgba(34, 211, 238, 0.2);">
            <div style="font-size: 12px; color: #22d3ee; font-weight: 700;">ACTIVE JOBS</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff;">${runningCount}</div>
          </div>
          <div style="padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="font-size: 12px; color: var(--text-secondary); font-weight: 700;">CREDITS REMAINING</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff;">${data.account?.credits || '631'}</div>
          </div>
        `;
      }
    } catch (err) {
      console.error('Failed to load CloudConvert stats:', err);
    }
  }

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
