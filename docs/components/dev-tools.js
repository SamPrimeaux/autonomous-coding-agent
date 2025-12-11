export default function DevTools() {
  return `
    <div style="padding: 24px 16px 80px; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
          Dev Tools
        </h1>
        <p style="font-size: 16px; color: var(--text-secondary);">
          Code editor, file explorer, and terminal
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 250px 1fr; gap: 24px; height: calc(100vh - 200px);">
        <!-- File Explorer -->
        <div class="card" style="overflow-y: auto;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">File Explorer</h3>
          <div id="file-tree" style="font-size: 13px;">
            <div style="padding: 8px; cursor: pointer; border-radius: 6px; margin-bottom: 4px; hover:background: var(--bg);">
              ?? snippets/
            </div>
            <div style="padding: 8px 8px 8px 24px; cursor: pointer; border-radius: 6px; margin-bottom: 4px;">
              ?? example.js
            </div>
            <div style="padding: 8px 8px 8px 24px; cursor: pointer; border-radius: 6px; margin-bottom: 4px;">
              ?? utils.ts
            </div>
          </div>
        </div>

        <!-- Main Editor Area -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Code Editor -->
          <div class="card" style="flex: 1; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="font-size: 16px; font-weight: 600;">Code Editor</h3>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary" id="format-btn" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">Format</button>
                <button class="btn btn-primary" id="save-btn" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">Save Snippet</button>
              </div>
            </div>
            <textarea 
              id="code-editor" 
              style="
                flex: 1;
                width: 100%;
                padding: 16px;
                border: 1px solid var(--border);
                border-radius: 8px;
                font-family: 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                resize: none;
                background: var(--bg);
              "
              placeholder="// Start coding here..."
            >function example() {
  console.log('Hello, MeauxOptions!');
  return true;
}</textarea>
          </div>

          <!-- Terminal Log -->
          <div class="card" style="height: 200px; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="font-size: 16px; font-weight: 600;">Terminal Output</h3>
              <button class="btn btn-secondary" id="run-btn" style="padding: 6px 12px; font-size: 12px; min-height: 32px;">Run</button>
            </div>
            <div 
              id="terminal-output" 
              style="
                flex: 1;
                overflow-y: auto;
                background: #1e293b;
                color: #e2e8f0;
                padding: 12px;
                border-radius: 8px;
                font-family: 'Monaco', 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.6;
              "
            >
              <div style="color: #64748b;">$ Ready. Type commands or click Run to execute code.</div>
            </div>
          </div>

          <!-- Tools Row -->
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" onclick="window.router.navigate('/dashboard/runtime')">
              Preview in Runtime
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Format button
  document.getElementById('format-btn')?.addEventListener('click', function () {
    const editor = document.getElementById('code-editor');
    // Simple formatter (in production, use a proper formatter)
    editor.value = editor.value
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}');
  });

  // Save snippet
  document.getElementById('save-btn')?.addEventListener('click', async function () {
    const editor = document.getElementById('code-editor');
    const content = editor.value;
    const name = prompt('Enter snippet name:', 'snippet.js');

    if (!name) return;

    try {
      const response = await fetch('/api/dev/save-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content, path: 'snippets/' })
      });

      if (response.ok) {
        alert('Snippet saved!');
      }
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  });

  // Run button
  document.getElementById('run-btn')?.addEventListener('click', async function () {
    const editor = document.getElementById('code-editor');
    const code = editor.value;
    const output = document.getElementById('terminal-output');

    output.innerHTML += `<div style="color: #64748b;">$ Running code...</div>`;

    try {
      const response = await fetch('/api/dev/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();

      output.innerHTML += `<div style="color: #10b981;">${data.output || 'Code executed successfully.'}</div>`;
      output.scrollTop = output.scrollHeight;
    } catch (error) {
      output.innerHTML += `<div style="color: #ef4444;">Error: ${error.message}</div>`;
      output.scrollTop = output.scrollHeight;
    }
  });
}
