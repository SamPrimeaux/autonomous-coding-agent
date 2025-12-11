// MeauxBoard Component (Kanban Board) for MeauxOS
export default function MeauxBoard() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">MeauxBoard</h1>
      <p class="page-subtitle">Kanban board for task management</p>
      <div style="margin-top: 1rem;">
        <button class="btn btn-primary" id="newTaskBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </button>
      </div>
    </div>
    <div style="padding: 0; max-width: 1800px; margin: 0 auto; overflow-x: auto;">
      <div id="boardContainer" style="display: flex; gap: 16px; min-width: fit-content; padding-bottom: 16px;">
        <!-- Columns will be rendered here -->
        <div class="board-column" data-status="todo" style="min-width: 300px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
          <div class="column-header" style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">??</span>
                <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">To Do</h3>
                <span class="badge badge-info" id="todoCount">3</span>
              </div>
            </div>
          </div>
          <div class="column-cards" id="todoCards" style="display: flex; flex-direction: column; gap: 12px; min-height: 200px;">
            <!-- Tasks will be loaded here -->
          </div>
        </div>

        <div class="board-column" data-status="in-progress" style="min-width: 300px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
          <div class="column-header" style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">??</span>
                <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">In Progress</h3>
                <span class="badge badge-warning" id="inProgressCount">2</span>
              </div>
            </div>
          </div>
          <div class="column-cards" id="inProgressCards" style="display: flex; flex-direction: column; gap: 12px; min-height: 200px;">
            <!-- Tasks will be loaded here -->
          </div>
        </div>

        <div class="board-column" data-status="done" style="min-width: 300px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
          <div class="column-header" style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">?</span>
                <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">Done</h3>
                <span class="badge badge-success" id="doneCount">4</span>
              </div>
            </div>
          </div>
          <div class="column-cards" id="doneCards" style="display: flex; flex-direction: column; gap: 12px; min-height: 200px;">
            <!-- Tasks will be loaded here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Load tasks from API (using existing /api/tasks endpoint)
  async function loadTasks() {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const tasks = await response.json();
        renderTasks(tasks);
      } else {
        // Use mock data
        const mockTasks = [
          { id: '1', title: 'Setup Cloudflare R2', description: 'Configure storage buckets', status: 'todo', priority: 'high', assignee: 'Sam' },
          { id: '2', title: 'Email Templates', description: 'Design team communications', status: 'todo', priority: 'medium', assignee: 'Fred' },
          { id: '3', title: 'MeauxTalk Integration', description: 'Connect messaging with Supabase', status: 'in-progress', priority: 'high', assignee: 'Connor' },
          { id: '4', title: 'Meaux Access Logo', description: 'Cloud logo with M lettermark', status: 'done', priority: 'high', assignee: 'Fred' }
        ];
        renderTasks(mockTasks);
      }
    } catch (error) {
      console.log('Tasks API not connected, using mock data');
      const mockTasks = [
        { id: '1', title: 'Setup Cloudflare R2', description: 'Configure storage buckets', status: 'todo', priority: 'high', assignee: 'Sam' },
        { id: '2', title: 'Email Templates', description: 'Design team communications', status: 'todo', priority: 'medium', assignee: 'Fred' },
        { id: '3', title: 'MeauxTalk Integration', description: 'Connect messaging with Supabase', status: 'in-progress', priority: 'high', assignee: 'Connor' },
        { id: '4', title: 'Meaux Access Logo', description: 'Cloud logo with M lettermark', status: 'done', priority: 'high', assignee: 'Fred' }
      ];
      renderTasks(mockTasks);
    }
  }

  function renderTasks(tasks) {
    const todoCards = document.getElementById('todoCards');
    const inProgressCards = document.getElementById('inProgressCards');
    const doneCards = document.getElementById('doneCards');
    const todoCount = document.getElementById('todoCount');
    const inProgressCount = document.getElementById('inProgressCount');
    const doneCount = document.getElementById('doneCount');

    if (!todoCards || !inProgressCards || !doneCards) return;

    const todo = tasks.filter(t => t.status === 'todo' || t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'in-progress' || t.status === 'in_progress');
    const done = tasks.filter(t => t.status === 'done' || t.status === 'completed');

    if (todoCount) todoCount.textContent = todo.length;
    if (inProgressCount) inProgressCount.textContent = inProgress.length;
    if (doneCount) doneCount.textContent = done.length;

    todoCards.innerHTML = todo.map(task => renderTaskCard(task)).join('');
    inProgressCards.innerHTML = inProgress.map(task => renderTaskCard(task)).join('');
    doneCards.innerHTML = done.map(task => renderTaskCard(task)).join('');

    // Add drag handlers
    document.querySelectorAll('.task-card').forEach(card => {
      card.draggable = true;
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
    });

    document.querySelectorAll('.board-column').forEach(column => {
      column.addEventListener('dragover', handleDragOver);
      column.addEventListener('drop', handleDrop);
    });
  }

  function renderTaskCard(task) {
    const priorityClass = task.priority === 'high' ? 'badge-danger' : task.priority === 'medium' ? 'badge-warning' : 'badge-info';
    return `
      <div class="task-card" draggable="true" data-task-id="${task.id}" style="
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px;
        cursor: move;
        transition: all 0.2s;
      ">
        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">${task.title}</div>
        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">${task.description || ''}</div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <span style="font-size: 12px; color: var(--text-secondary);">${task.assignee || 'Unassigned'}</span>
          <span class="badge ${priorityClass}" style="font-size: 11px;">${task.priority || 'low'}</span>
        </div>
      </div>
    `;
  }

  let draggedTask = null;

  function handleDragStart(e) {
    draggedTask = e.target;
    e.target.style.opacity = '0.5';
  }

  function handleDragEnd(e) {
    e.target.style.opacity = '1';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.background = 'var(--bg-hover)';
  }

  async function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';

    if (!draggedTask) return;

    const newStatus = e.currentTarget.dataset.status;
    const taskId = draggedTask.dataset.taskId;

    // Update task status via API
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadTasks(); // Reload tasks
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  // New task button
  const newTaskBtn = document.getElementById('newTaskBtn');
  if (newTaskBtn) {
    newTaskBtn.addEventListener('click', () => {
      alert('New task form coming soon. API endpoint: POST /api/tasks');
    });
  }

  loadTasks();
}
