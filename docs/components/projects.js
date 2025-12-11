// Projects Component for MeauxOS
export default function Projects() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">Projects</h1>
      <p class="page-subtitle">Manage your active projects and track progress</p>
      <div style="margin-top: 1rem;">
        <button class="btn btn-primary" id="newProjectBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Project
        </button>
      </div>
    </div>
    <div style="padding: 0; max-width: 1600px; margin: 0 auto;">
      <!-- Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div class="card">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Active Projects</div>
          <div style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;" id="activeProjectsCount">12</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--success);">+3 this week</div>
        </div>
        <div class="card">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Completed</div>
          <div style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;" id="completedProjectsCount">8</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">This month</div>
        </div>
        <div class="card">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Team Members</div>
          <div style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;" id="teamMembersCount">8</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--success);">All active</div>
        </div>
      </div>

      <!-- Projects Grid -->
      <div id="projectsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
        <!-- Projects will be loaded here via API -->
        <div class="card" style="padding: 24px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Website Redesign</h3>
              <p style="font-size: 14px; color: var(--text-secondary);">Modern responsive design system</p>
            </div>
            <span class="badge badge-success" style="flex-shrink: 0;">Active</span>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Updated 2 hours ago
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              5 team members
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="flex: 1; font-size: 13px;">View Details</button>
            <button class="btn btn-ghost" style="padding: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>

        <div class="card" style="padding: 24px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Mobile App Launch</h3>
              <p style="font-size: 14px; color: var(--text-secondary);">iOS and Android development</p>
            </div>
            <span class="badge badge-warning" style="flex-shrink: 0;">In Progress</span>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Updated yesterday
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              3 team members
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="flex: 1; font-size: 13px;">View Details</button>
            <button class="btn btn-ghost" style="padding: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Load projects from API
  async function loadProjects() {
    try {
      const response = await fetch('/api/meauxaccess/projects');
      if (response.ok) {
        const projects = await response.json();
        renderProjects(projects);
        updateStats(projects);
      } else {
        console.log('Projects API not connected yet, using mock data');
      }
    } catch (error) {
      console.log('Projects API not connected yet, using mock data');
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = projects.map(project => `
      <div class="card" style="padding: 24px; cursor: pointer; transition: all 0.2s;" data-project-id="${project.id}">
        <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${project.name}</h3>
            <p style="font-size: 14px; color: var(--text-secondary);">${project.description || ''}</p>
          </div>
          <span class="badge badge-${project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'warning'}" style="flex-shrink: 0;">${project.status}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Updated ${formatTime(project.updated_at)}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            ${project.team_count || 0} team members
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="flex: 1; font-size: 13px;" onclick="window.router.navigate('/dashboard/work/board?project=${project.id}')">View Board</button>
          <button class="btn btn-ghost" style="padding: 8px;" onclick="editProject('${project.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  function updateStats(projects) {
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;

    const activeEl = document.getElementById('activeProjectsCount');
    const completedEl = document.getElementById('completedProjectsCount');

    if (activeEl) activeEl.textContent = active;
    if (completedEl) completedEl.textContent = completed;
  }

  function formatTime(timestamp) {
    if (!timestamp) return 'recently';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // New project button
  const newProjectBtn = document.getElementById('newProjectBtn');
  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', () => {
      // TODO: Open new project modal
      alert('New project form coming soon. API endpoint: POST /api/meauxaccess/projects');
    });
  }

  loadProjects();
}
