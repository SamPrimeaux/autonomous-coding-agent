// Legacy dashboard pointer to Home + key modules
export default function Dashboard() {
  return `
    <style>
      .dash-wrap { padding: 20px; font-family:'Inter', sans-serif; color:#0f172a; }
      .dash-grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
      .dash-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:14px; box-shadow:0 10px 30px rgba(15,23,42,0.08); }
      .dash-card h3 { margin:0 0 8px; font-size:16px; }
      .dash-meta { color:#64748b; font-size:13px; margin:0 0 10px; }
      .dash-btn { display:inline-block; padding:8px 10px; border-radius:10px; border:1px solid #e2e8f0; background:#0ea5e9; color:white; font-weight:600; text-decoration:none; }
    </style>
    <div class="dash-wrap">
      <h2 style="margin:0 0 8px;">Dashboard</h2>
      <p style="margin:0 0 14px; color:#475569;">Use Home for full overview. Quick shortcuts below.</p>
      <div class="dash-grid">
        <div class="dash-card">
          <h3>Home Overview</h3><p class="dash-meta">Live metrics & quick actions</p>
          <a class="dash-btn" href="/" data-route="/">Open Home</a>
        </div>
        <div class="dash-card">
          <h3>R2 Storage</h3><p class="dash-meta">Buckets & objects</p>
          <a class="dash-btn" href="/dashboard/r2" data-route="/dashboard/r2">Open R2</a>
        </div>
        <div class="dash-card">
          <h3>Uploads</h3><p class="dash-meta">Analyze & deploy</p>
          <a class="dash-btn" href="/dashboard/upload" data-route="/dashboard/upload">Smart Upload</a>
        </div>
      </div>
    </div>
  `;
}

export function init() { }
// iAccess Dashboard Component
let requestChart, serviceChart, costChart;

export default function Dashboard() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Real-time platform metrics and analytics</p>
    </div>
    <div style="padding: 0; max-width: 1800px; margin: 0 auto;">
      <!-- Page Header -->
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary), var(--text-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Dashboard
        </h1>
        <p style="color: var(--text-secondary); font-size: 1rem; font-weight: 500;">
          Real-time platform metrics and analytics
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
        <div class="stat-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; transition: all 0.3s ease; cursor: pointer;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(31, 151, 169, 0.2), rgba(31, 151, 169, 0.05)); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 24px;">📊</div>
            <div class="stat-change positive" style="display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-weight: 600; padding: 4px 10px; border-radius: 8px; background: var(--success-light); color: var(--status-success);">
              <span>+23%</span>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div class="stat-value" id="requests-value" style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); line-height: 1.2;">8.4M</div>
            <div class="stat-label" style="font-size: 0.875rem; color: var(--text-muted); font-weight: 500; margin-top: 4px;">Total Requests</div>
          </div>
        </div>

        <div class="stat-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; transition: all 0.3s ease; cursor: pointer;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(74, 236, 220, 0.2), rgba(74, 236, 220, 0.05)); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 24px;">⚡</div>
            <div class="stat-change positive" style="display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-weight: 600; padding: 4px 10px; border-radius: 8px; background: var(--success-light); color: var(--status-success);">
              <span>-12%</span>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div class="stat-value" id="latency-value" style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); line-height: 1.2;">47ms</div>
            <div class="stat-label" style="font-size: 0.875rem; color: var(--text-muted); font-weight: 500; margin-top: 4px;">Avg Response Time</div>
          </div>
        </div>

        <div class="stat-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; transition: all 0.3s ease; cursor: pointer;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05)); display: flex; align-items: center; justify-content: center; color: var(--warning); font-size: 24px;">💰</div>
            <div class="stat-change positive" style="display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-weight: 600; padding: 4px 10px; border-radius: 8px; background: var(--success-light); color: var(--status-success);">
              <span>+8%</span>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div class="stat-value" id="cost-value" style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); line-height: 1.2;">$847</div>
            <div class="stat-label" style="font-size: 0.875rem; color: var(--text-muted); font-weight: 500; margin-top: 4px;">Monthly Cost</div>
          </div>
        </div>

        <div class="stat-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; transition: all 0.3s ease; cursor: pointer;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(31, 151, 169, 0.2), rgba(31, 151, 169, 0.05)); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 24px;">📊</div>
            <div class="stat-change positive" style="display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-weight: 600; padding: 4px 10px; border-radius: 8px; background: var(--success-light); color: var(--status-success);">
              <span>+34%</span>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div class="stat-value" id="ai-calls-value" style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); line-height: 1.2;">142K</div>
            <div class="stat-label" style="font-size: 0.875rem; color: var(--text-muted); font-weight: 500; margin-top: 4px;">AI API Calls</div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; margin-bottom: 32px;">
        <div class="chart-card large" style="grid-column: span 8; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
              <div style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary);">Request Volume & Latency</div>
              <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 4px;">Last 7 days</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="filter-btn active" data-days="7" style="padding: 8px 16px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; background: var(--primary); color: white; border: 1px solid var(--primary);">7D</button>
              <button class="filter-btn" data-days="30" style="padding: 8px 16px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border);">30D</button>
              <button class="filter-btn" data-days="90" style="padding: 8px 16px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border);">90D</button>
            </div>
          </div>
          <div style="position: relative; height: 320px;">
            <canvas id="requestChart"></canvas>
          </div>
        </div>

        <div class="chart-card small" style="grid-column: span 4; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px;">
          <div style="margin-bottom: 24px;">
            <div style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary);">Service Distribution</div>
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 4px;">By request count</div>
          </div>
          <div style="position: relative; height: 320px;">
            <canvas id="serviceChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Services Table -->
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden;">
        <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary);">Active Services</div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="padding: 8px 16px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border);">Refresh</button>
          </div>
        </div>
        <table class="data-table" style="width: 100%; border-collapse: collapse;">
          <thead style="background: var(--bg-elevated);">
            <tr>
              <th style="padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Service</th>
              <th style="padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Type</th>
              <th style="padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Requests</th>
              <th style="padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Latency</th>
              <th style="padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Status</th>
              <th style="padding: 16px 24px; text-align: left; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Cost</th>
            </tr>
          </thead>
          <tbody id="servicesTableBody">
            <tr style="transition: all 0.2s ease; cursor: pointer;">
              <td style="padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9375rem; font-weight: 600; color: var(--text-primary);">damnsam-worker</td>
              <td style="padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9375rem;">Worker</td>
              <td style="padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9375rem;">2.1M</td>
              <td style="padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9375rem;">42ms</td>
              <td style="padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9375rem;">
                <span class="status-badge success" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 12px; font-size: 0.8125rem; font-weight: 600; background: var(--success-light); color: var(--status-success);">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: currentColor;"></span>
                  Healthy
                </span>
              </td>
              <td style="padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9375rem; font-weight: 600; color: var(--text-primary);">$127</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function init() {
  console.log('Dashboard init');

  // Initialize charts
  initCharts();

  // Set up filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'var(--bg-elevated)';
        b.style.color = 'var(--text-secondary)';
        b.style.border = '1px solid var(--border)';
      });
      e.target.classList.add('active');
      e.target.style.background = 'var(--primary)';
      e.target.style.color = 'white';
      e.target.style.border = '1px solid var(--primary)';

      const days = parseInt(e.target.dataset.days);
      updateCharts(days);
    });
  });

  // Add hover effects to stat cards
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
      this.style.borderColor = 'var(--primary)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
      this.style.borderColor = 'var(--border)';
    });
  });
}

function initCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          font: { family: 'Inter', size: 12 }
        }
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
  };

  // Request Volume Chart
  const requestCtx = document.getElementById('requestChart');
  if (requestCtx) {
    requestChart = new Chart(requestCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Requests',
          data: [1.2, 1.5, 1.3, 1.8, 1.6, 1.4, 1.7],
          borderColor: '#1F97A9',
          backgroundColor: 'rgba(31, 151, 169, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Latency (ms)',
          data: [52, 48, 45, 47, 46, 44, 47],
          borderColor: '#4AECDC',
          backgroundColor: 'rgba(74, 236, 220, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
          fill: true
        }]
      },
      options: {
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          y: {
            ...chartOptions.scales.y,
            position: 'left'
          },
          y1: {
            ...chartOptions.scales.y,
            position: 'right',
            grid: { display: false }
          }
        }
      }
    });
  }

  // Service Distribution Chart
  const serviceCtx = document.getElementById('serviceChart');
  if (serviceCtx) {
    serviceChart = new Chart(serviceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Workers', 'AI Gateway', 'R2', 'D1', 'Other'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            '#1F97A9',
            '#4AECDC',
            '#F59E0B',
            '#8B5CF6',
            '#64748B'
          ],
          borderWidth: 0
        }]
      },
      options: chartOptions
    });
  }
}

function updateCharts(days) {
  // Update chart data based on selected time range
  console.log('Updating charts for', days, 'days');
  // In production, fetch new data from API
}
