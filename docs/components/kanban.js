// Minimal Kanban UI (vanilla JS) with API + Realtime hooks
export default function Kanban() {
  return `
    <style>
      .kanban-root { padding: 16px; font-family: 'Inter', sans-serif; }
      .kanban-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; }
      .kanban-columns { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
      .kanban-col { min-width: 260px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; }
      .kanban-col h3 { margin: 0 0 8px 0; font-size: 15px; }
      .kanban-task { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; margin-bottom: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); cursor: grab; }
      .kanban-add { padding: 6px 8px; border: 1px dashed #cbd5e1; border-radius: 10px; background: #fff; cursor: pointer; text-align: center; font-size: 13px; }
      .kanban-input { width: 100%; box-sizing: border-box; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 8px; }
    </style>
    <div class="kanban-root">
      <div class="kanban-header">
        <div>
          <h2 style="margin:0;font-size:18px;">Kanban</h2>
          <div id="kanban-board-name" style="color:#64748b;font-size:13px;">Loading board...</div>
        </div>
        <button id="kanban-add-column" class="kanban-add">+ Column</button>
      </div>
      <div class="kanban-columns" id="kanban-columns"></div>
    </div>
  `;
}

export function init() {
  initKanban();
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  return res.json();
}

async function initKanban() {
  const columnsEl = document.getElementById('kanban-columns');
  const boardNameEl = document.getElementById('kanban-board-name');
  if (!columnsEl) return;
  let draggedId = null;

  // Ensure a board exists
  let boards = await fetchJSON('/api/kanban/boards');
  let board = boards[0];
  if (!board) {
    const created = await fetchJSON('/api/kanban/boards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Workspace' }) });
    board = { id: created.id, name: created.name };
  }
  boardNameEl.textContent = board.name;

  async function loadColumns() {
    const cols = await fetchJSON(`/api/kanban/columns?boardId=${encodeURIComponent(board.id)}`);
    columnsEl.innerHTML = '';
    for (const col of cols) {
      const colDiv = document.createElement('div');
      colDiv.className = 'kanban-col';
      colDiv.innerHTML = `
        <h3>${col.title}</h3>
        <div class="kanban-tasks" data-column="${col.id}"></div>
        <button class="kanban-add" data-add-task="${col.id}">+ Task</button>
      `;
      columnsEl.appendChild(colDiv);
      await loadTasks(col.id);
    }
    wireAddTask();
    wireDragDrop();
  }

  async function loadTasks(columnId) {
    const tasks = await fetchJSON(`/api/kanban/tasks?columnId=${encodeURIComponent(columnId)}`);
    const container = document.querySelector(`.kanban-tasks[data-column="${columnId}"]`);
    if (!container) return;
    container.innerHTML = '';
    tasks.forEach((t, idx) => {
      const card = document.createElement('div');
      card.className = 'kanban-task';
      card.draggable = true;
      card.dataset.taskId = t.id;
      card.dataset.columnId = columnId;
      card.dataset.order = t.order ?? idx;
      card.innerHTML = `
        <div class="task-title" style="font-weight:700; cursor:pointer;">${t.title}</div>
        <div style="color:#475569;font-size:12px;">${t.priority || 'normal'} · ${t.assignee || 'unassigned'}</div>
        ${t.description ? `<div style="color:#94a3b8;font-size:12px;margin-top:4px;">${t.description}</div>` : ''}
      `;
      card.querySelector('.task-title').addEventListener('click', () => editTask(t, columnId));
      container.appendChild(card);
    });
  }

  // Add column
  document.getElementById('kanban-add-column')?.addEventListener('click', async () => {
    const title = prompt('Column title?') || 'Column';
    await fetchJSON('/api/kanban/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: board.id, title })
    });
    await loadColumns();
  });

  function wireAddTask() {
    document.querySelectorAll('[data-add-task]').forEach(btn => {
      btn.onclick = async () => {
        const colId = btn.dataset.addTask;
        const title = prompt('Task title?') || 'Task';
        const priority = prompt('Priority? (low/normal/high)', 'normal') || 'normal';
        const assignee = prompt('Assignee?', '') || '';
        const description = prompt('Description?', '') || '';
        await fetchJSON('/api/kanban/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columnId: colId, title, priority, assignee, description })
        });
        await loadTasks(colId);
      };
    });
  }

  function editTask(task, columnId) {
    const title = prompt('Task title', task.title) || task.title;
    const priority = prompt('Priority? (low/normal/high)', task.priority || 'normal') || task.priority || 'normal';
    const assignee = prompt('Assignee?', task.assignee || '') || task.assignee || '';
    const description = prompt('Description?', task.description || '') || task.description || '';
    fetchJSON(`/api/kanban/tasks/${encodeURIComponent(task.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority, assignee, description })
    }).then(() => loadTasks(columnId));
  }

  await loadColumns();

  // Realtime listener
  connectRealtime('kanban', async () => {
    await loadColumns();
  });

  function wireDragDrop() {
    const cards = document.querySelectorAll('.kanban-task');
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        draggedId = card.dataset.taskId;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', () => {
        draggedId = null;
        card.classList.remove('dragging');
      });
    });

    const zones = document.querySelectorAll('.kanban-tasks');
    zones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const afterElement = getDragAfterElement(zone, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;
        if (afterElement == null) {
          zone.appendChild(draggable);
        } else {
          zone.insertBefore(draggable, afterElement);
        }
      });
      zone.addEventListener('drop', async (e) => {
        e.preventDefault();
        const columnId = zone.dataset.column;
        const ordered = Array.from(zone.querySelectorAll('.kanban-task')).map((el, idx) => ({
          id: el.dataset.taskId,
          order: idx
        }));
        for (const item of ordered) {
          await fetchJSON(`/api/kanban/tasks/${encodeURIComponent(item.id)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columnId, order: item.order })
          });
        }
        await loadColumns();
      });
    });
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-task:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
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
