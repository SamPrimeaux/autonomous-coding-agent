// Workflow Builder Component - Visual Pipeline Builder
export default function WorkflowBuilder() {
  return `
    <div class="workflow-builder">
      <div class="workflow-header">
        <h2>Workflow Builder</h2>
        <div class="header-actions">
          <button class="btn-secondary" id="save-workflow-btn">Save</button>
          <button class="btn-primary" id="run-workflow-btn">Run</button>
        </div>
      </div>

      <div class="workflow-container">
        <!-- Node Palette -->
        <div class="node-palette">
          <h3>Nodes</h3>
          <div class="node-list">
            <div class="node-item" draggable="true" data-node-type="trigger">
              <div class="node-icon">?</div>
              <div class="node-name">Trigger</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="api">
              <div class="node-icon">??</div>
              <div class="node-name">API Call</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="transform">
              <div class="node-icon">??</div>
              <div class="node-name">Transform</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="condition">
              <div class="node-icon">?</div>
              <div class="node-name">Condition</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="delay">
              <div class="node-icon">??</div>
              <div class="node-name">Delay</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="ai">
              <div class="node-icon">??</div>
              <div class="node-name">AI Action</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="storage">
              <div class="node-icon">??</div>
              <div class="node-name">Storage</div>
            </div>
            <div class="node-item" draggable="true" data-node-type="notification">
              <div class="node-icon">??</div>
              <div class="node-name">Notification</div>
            </div>
          </div>
        </div>

        <!-- Canvas -->
        <div class="workflow-canvas" id="workflow-canvas">
          <div class="canvas-grid"></div>
          <svg class="connection-layer" id="connection-layer"></svg>
          <div class="nodes-container" id="nodes-container">
            <div class="empty-state">
              <div class="empty-icon">??</div>
              <h3>Start Building</h3>
              <p>Drag nodes from the palette to create your workflow</p>
            </div>
          </div>
        </div>

        <!-- Properties Panel -->
        <div class="properties-panel" id="properties-panel">
          <h3>Properties</h3>
          <div class="properties-content" id="properties-content">
            <p class="placeholder">Select a node to edit its properties</p>
          </div>
        </div>
      </div>

      <!-- Workflow List Modal -->
      <div class="modal" id="workflows-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Saved Workflows</h2>
            <button class="modal-close" data-modal="workflows-modal">&times;</button>
          </div>
          <div class="workflows-list" id="saved-workflows-list">
            <div class="loading">Loading workflows...</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let nodeCounter = 0;
let selectedNode = null;
let nodes = [];
let connections = [];

export function init() {
  initCanvas();
  initNodePalette();
  initProperties();
  loadWorkflows();
}

function initCanvas() {
  const canvas = document.getElementById('workflow-canvas');
  const nodesContainer = document.getElementById('nodes-container');

  // Allow dropping nodes
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvas.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', () => {
    canvas.classList.remove('drag-over');
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');

    const nodeType = e.dataTransfer.getData('node-type');
    if (nodeType) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createNode(nodeType, x, y);
    }
  });

  // Handle node selection
  nodesContainer.addEventListener('click', (e) => {
    const node = e.target.closest('.workflow-node');
    if (node) {
      selectNode(node.dataset.nodeId);
    } else {
      deselectNode();
    }
  });
}

function initNodePalette() {
  document.querySelectorAll('.node-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('node-type', item.dataset.nodeType);
    });
  });
}

function createNode(type, x, y) {
  const nodeId = `node-${++nodeCounter}`;
  const node = {
    id: nodeId,
    type: type,
    x: x,
    y: y,
    config: getDefaultConfig(type)
  };

  nodes.push(node);
  renderNode(node);

  // Remove empty state
  const emptyState = document.querySelector('.empty-state');
  if (emptyState) emptyState.remove();
}

function renderNode(node) {
  const nodesContainer = document.getElementById('nodes-container');
  const nodeEl = document.createElement('div');
  nodeEl.className = 'workflow-node';
  nodeEl.dataset.nodeId = node.id;
  nodeEl.style.left = `${node.x}px`;
  nodeEl.style.top = `${node.y}px`;

  nodeEl.innerHTML = `
    <div class="node-header">
      <span class="node-icon">${getNodeIcon(node.type)}</span>
      <span class="node-title">${getNodeTitle(node.type)}</span>
    </div>
    <div class="node-body">
      ${getNodePreview(node)}
    </div>
    <div class="node-ports">
      <div class="port port-input" data-port="input"></div>
      <div class="port port-output" data-port="output"></div>
    </div>
  `;

  // Make node draggable
  makeNodeDraggable(nodeEl, node);

  nodesContainer.appendChild(nodeEl);
}

function makeNodeDraggable(nodeEl, node) {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  nodeEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.port')) return; // Don't drag when clicking ports

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = node.x;
    initialY = node.y;
    nodeEl.classList.add('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    node.x = initialX + dx;
    node.y = initialY + dy;
    nodeEl.style.left = `${node.x}px`;
    nodeEl.style.top = `${node.y}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      nodeEl.classList.remove('dragging');
    }
  });
}

function selectNode(nodeId) {
  deselectNode();
  selectedNode = nodes.find(n => n.id === nodeId);
  const nodeEl = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (nodeEl) {
    nodeEl.classList.add('selected');
    updateProperties(selectedNode);
  }
}

function deselectNode() {
  document.querySelectorAll('.workflow-node').forEach(n => n.classList.remove('selected'));
  selectedNode = null;
  document.getElementById('properties-content').innerHTML = '<p class="placeholder">Select a node to edit its properties</p>';
}

function updateProperties(node) {
  const content = document.getElementById('properties-content');
  content.innerHTML = `
    <div class="property-group">
      <label>Node Type</label>
      <input type="text" value="${node.type}" disabled>
    </div>
    ${getPropertyFields(node)}
  `;

  // Add event listeners for property changes
  content.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('change', (e) => {
      const key = e.target.name;
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      node.config[key] = value;
    });
  });
}

function getPropertyFields(node) {
  switch (node.type) {
    case 'api':
      return `
        <div class="property-group">
          <label>API Endpoint</label>
          <input type="text" name="endpoint" value="${node.config.endpoint || ''}" placeholder="/api/...">
        </div>
        <div class="property-group">
          <label>Method</label>
          <select name="method">
            <option value="GET" ${node.config.method === 'GET' ? 'selected' : ''}>GET</option>
            <option value="POST" ${node.config.method === 'POST' ? 'selected' : ''}>POST</option>
            <option value="PUT" ${node.config.method === 'PUT' ? 'selected' : ''}>PUT</option>
            <option value="DELETE" ${node.config.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
          </select>
        </div>
      `;
    case 'condition':
      return `
        <div class="property-group">
          <label>Condition</label>
          <input type="text" name="condition" value="${node.config.condition || ''}" placeholder="data.value > 10">
        </div>
      `;
    case 'ai':
      return `
        <div class="property-group">
          <label>AI Model</label>
          <select name="model">
            <option value="gpt-4" ${node.config.model === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
            <option value="claude" ${node.config.model === 'claude' ? 'selected' : ''}>Claude</option>
            <option value="gemini" ${node.config.model === 'gemini' ? 'selected' : ''}>Gemini</option>
          </select>
        </div>
        <div class="property-group">
          <label>Prompt</label>
          <textarea name="prompt" rows="4">${node.config.prompt || ''}</textarea>
        </div>
      `;
    default:
      return '<p>No additional properties for this node type</p>';
  }
}

function getDefaultConfig(type) {
  const configs = {
    trigger: { event: 'manual' },
    api: { endpoint: '', method: 'GET' },
    transform: { script: '' },
    condition: { condition: '' },
    delay: { duration: 1000 },
    ai: { model: 'gpt-4', prompt: '' },
    storage: { action: 'read', key: '' },
    notification: { type: 'email', recipient: '' }
  };
  return configs[type] || {};
}

function getNodeIcon(type) {
  const icons = {
    trigger: '?',
    api: '??',
    transform: '??',
    condition: '?',
    delay: '??',
    ai: '??',
    storage: '??',
    notification: '??'
  };
  return icons[type] || '??';
}

function getNodeTitle(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getNodePreview(node) {
  if (node.config.endpoint) return node.config.endpoint;
  if (node.config.condition) return node.config.condition;
  return '';
}

async function loadWorkflows() {
  try {
    const res = await fetch('/api/workflows');
    const data = await res.json();
    const list = document.getElementById('saved-workflows-list');

    if (data.length > 0) {
      list.innerHTML = data.map(wf => `
        <div class="workflow-item">
          <h4>${wf.name}</h4>
          <p>${wf.description || 'No description'}</p>
          <div class="workflow-actions">
            <button class="btn-sm" onclick="loadWorkflow('${wf.id}')">Load</button>
            <button class="btn-sm btn-danger" onclick="deleteWorkflow('${wf.id}')">Delete</button>
          </div>
        </div>
      `).join('');
    } else {
      list.innerHTML = '<div class="empty-state">No saved workflows</div>';
    }
  } catch (error) {
    console.error('Error loading workflows:', error);
  }
}

// Save workflow
document.getElementById('save-workflow-btn')?.addEventListener('click', async () => {
  const name = prompt('Workflow name:');
  if (!name) return;

  const workflow = {
    name,
    nodes,
    connections,
    description: ''
  };

  try {
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });

    if (res.ok) {
      alert('Workflow saved!');
      loadWorkflows();
    }
  } catch (error) {
    alert('Error saving workflow: ' + error.message);
  }
});

// Run workflow
document.getElementById('run-workflow-btn')?.addEventListener('click', async () => {
  if (nodes.length === 0) {
    alert('Add nodes to your workflow first');
    return;
  }

  try {
    const res = await fetch('/api/workflows/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, connections })
    });

    const result = await res.json();
    alert('Workflow executed! Check console for results.');
    console.log('Workflow result:', result);
  } catch (error) {
    alert('Error executing workflow: ' + error.message);
  }
});
