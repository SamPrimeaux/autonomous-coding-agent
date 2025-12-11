export default function Overview() {
  return `
    <div style="padding: 24px 16px 80px; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
          Dashboard Overview
        </h1>
        <p style="font-size: 16px; color: var(--text-secondary);">
          Welcome back, Sam!
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div class="quick-action" style="
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        ">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C4.46957 16 3.96086 15.7893 3.58579 15.4142C3.21071 15.0391 3 14.5304 3 14V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V14C21 14.5304 20.7893 15.0391 20.4142 15.4142C20.0391 15.7893 19.5304 16 19 16H14L9 21V16Z"/>
            </svg>
          </div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Team Chat</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">MeauxTalk</p>
        </div>

        <div class="quick-action" style="
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        ">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #1F97A9, #26B4C9);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="13" width="7" height="7" rx="1"/>
              <rect x="13" y="3" width="7" height="16" rx="1"/>
            </svg>
          </div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Projects</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">MeauxBoard</p>
        </div>

        <div class="quick-action" style="
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        ">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <rect x="3" y="5" width="18" height="14" rx="2"/>
              <circle cx="9" cy="10" r="2"/>
              <path d="M3 15L7 11L11 15L15 11L21 17V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V15Z"/>
            </svg>
          </div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Images</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">MeauxPhoto</p>
        </div>

        <div class="quick-action" style="
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        ">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #10b981, #059669);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z"/>
            </svg>
          </div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Video</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">Meet</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div class="card">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Total Assets</div>
          <div style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 6px;">24</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--success);">+12% this month</div>
        </div>

        <div class="card">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Active Projects</div>
          <div style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 6px;">12</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--success);">+3 this week</div>
        </div>

        <div class="card">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Team Members</div>
          <div style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 6px;">8</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--success);">All active</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">MeauxLife Platform</h2>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">
          Unified workspace for team collaboration, project management, and app deployment.
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="window.router.navigate('/dashboard/agents')">AI Agents</button>
          <button class="btn btn-secondary" onclick="window.router.navigate('/dashboard/dev-tools')">Dev Tools</button>
          <button class="btn btn-secondary" onclick="window.router.navigate('/dashboard/runtime')">Runtime</button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Add hover effects
  document.querySelectorAll('.quick-action').forEach(action => {
    action.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
    });
    action.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
}
