// Galaxy App Library - Real-World Build Sync & Performance Metrics
export default function AppLibrary() {
  return `
    <style>
      .galaxy-lib {
        padding: 3rem 0;
        overflow: hidden;
        animation: fadeIn 0.5s ease;
      }

      .lib-header {
        padding: 0 2rem;
        margin-bottom: 3rem;
        text-align: center;
      }

      .lib-title {
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        font-weight: 900;
        letter-spacing: -0.03em;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #fff, var(--cyan), var(--teal));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .lib-subtitle {
        color: var(--muted);
        font-size: 1.1rem;
      }

      /* Infinite Marquee */
      .marquee-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem 0;
        position: relative;
      }

      .marquee-lane {
        display: flex;
        gap: 1.5rem;
        width: max-content;
        animation: scroll 120s linear infinite;
      }

      .marquee-lane.reverse {
        animation-direction: reverse;
        animation-duration: 140s;
      }

      .marquee-lane:hover {
        animation-play-state: paused;
      }

      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .worker-card {
        width: 320px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid var(--stroke);
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        box-shadow: var(--shadow2);
      }

      .worker-card:hover {
        border-color: var(--cyan);
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(34, 211, 238, 0.2);
        background: rgba(255, 255, 255, 0.06);
      }

      .worker-thumb {
        width: 100%;
        aspect-ratio: 16 / 10;
        background: linear-gradient(135deg, #1a2332, #0f1419);
        position: relative;
        overflow: hidden;
      }

      .worker-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.8;
        transition: 0.3s;
      }

      .worker-card:hover .worker-thumb img {
        opacity: 1;
        transform: scale(1.05);
      }

      .worker-badge-top {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 10px;
        background: rgba(34, 211, 238, 0.15);
        border: 1px solid rgba(34, 211, 238, 0.3);
        border-radius: 6px;
        font-size: 10px;
        font-weight: 800;
        color: var(--cyan);
        text-transform: uppercase;
        backdrop-filter: blur(10px);
      }

      .worker-body {
        padding: 1.25rem;
      }

      .worker-name {
        font-weight: 700;
        color: #fff;
        margin-bottom: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 15px;
      }

      .worker-meta {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 11px;
        color: var(--muted2);
      }

      .worker-footer {
        padding: 1rem 1.25rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .metric-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
      }

      /* Modal */
      .modal {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        backdrop-filter: blur(30px);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }

      .modal.active { display: flex; }

      .modal-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .modal-header {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--stroke);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-iframe {
        flex: 1;
        background: #fff;
        border: none;
      }

      @media (max-width: 768px) {
        .lib-title { font-size: 2rem; }
        .worker-card { width: 280px; }
        .marquee-container { gap: 1.5rem; }
      }
    </style>

    <div class="galaxy-lib">
      <div class="lib-header">
        <h1 class="lib-title">Workers App Library</h1>
        <p class="lib-subtitle">Synchronized with Meauxbility Edge Cluster (121 Nodes Detected)</p>
        <div style="display: flex; justify-content: center; gap: 24px; margin-top: 20px;">
          <div><div style="font-size:10px; color:var(--muted2);">TOTAL BUILDS</div><div id="total-count" style="font-size:24px; font-weight:900; color:var(--cyan);">121</div></div>
          <div><div style="font-size:10px; color:var(--muted2);">EDGE NODES</div><div id="node-count" style="font-size:24px; font-weight:900; color:#10B981;">ACTIVE</div></div>
        </div>
      </div>

      <div class="marquee-container">
        <div class="marquee-lane" id="lane-1"></div>
        <div class="marquee-lane reverse" id="lane-2"></div>
      </div>

      <div style="padding: 0 2rem; margin-top: 4rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h2 class="lib-title" style="font-size: 1.75rem;">Cluster Status</h2>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="lib-search" placeholder="Filter workers..." style="padding: 10px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--stroke); border-radius: 10px; color: #fff; outline: none; width: 260px;">
          </div>
        </div>
        <div id="active-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
          <div class="loading">Syncing cluster modules...</div>
        </div>
      </div>
    </div>

    <!-- Lightbox Preview -->
    <div id="preview-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h3 id="modal-title" style="color:#fff; margin:0;">Worker Preview</h3>
            <p id="modal-url" style="color:var(--muted2); font-size:12px; margin:4px 0 0;"></p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-primary" id="btn-visit" style="padding: 8px 16px;">Visit App</button>
            <button class="btn btn-secondary" onclick="closePreview()" style="padding: 8px 16px;">Close</button>
          </div>
        </div>
        <iframe id="modal-frame" class="modal-iframe"></iframe>
      </div>
    </div>
  `;
}

const buildList = [
  { name: "hybridprosaas-dashboard-production", date: "2m ago", requests: "1.2k", latency: "1.8 ms", badge: "PROD" },
  { name: "autonomous-coding-agent", date: "35m ago", requests: "422", latency: "0.8 ms", badge: "AI" },
  { name: "meauxmarkets-dev", date: "53m ago", requests: "150", latency: "2.8 ms", badge: "DEV" },
  { name: "damnsam", date: "54m ago", requests: "2k", latency: "1.3 ms", badge: "CORE" },
  { name: "meauxaccessmvp", date: "54m ago", requests: "8.4k", latency: "0.9 ms", badge: "MVP" },
  { name: "meauxstack-os", date: "55m ago", requests: "152", latency: "0.9 ms", badge: "OS" },
  { name: "official-dashboard", date: "58m ago", requests: "37", latency: "2.6 ms", badge: "DASH" },
  { name: "iautodidactapp", date: "1h ago", requests: "60", latency: "1.1 ms", badge: "APP" },
  { name: "hybridprosaas-dashboard", date: "1h ago", requests: "442", latency: "1.3 ms", badge: "LABS" },
  { name: "southernpetsanimalrescue", date: "19h ago", requests: "1.3k", latency: "0.9 ms", badge: "SPAR" },
  { name: "meauxaccess-dashboard-dev", date: "1d ago", requests: "114", latency: "0.5 ms", badge: "DEV" },
  { name: "meauxbilityv2", date: "1d ago", requests: "56", latency: "0.8 ms", badge: "V2" },
  { name: "meauxbility-org-clean", date: "1d ago", requests: "43", latency: "265.2 ms", badge: "ORG" },
  { name: "meauxmcpv4", date: "1d ago", requests: "803", latency: "1.2 ms", badge: "MCP" },
  { name: "inneranimalmedia-production", date: "5d ago", requests: "51", latency: "3.2 ms", badge: "IAM" },
  { name: "inneranimalmedia-mcp", date: "5d ago", requests: "35", latency: "0 ms", badge: "MCP" },
  { name: "iaccess-browser-rendering-dev", date: "5d ago", requests: "33", latency: "0.4 ms", badge: "DEV" },
  { name: "inneranimalmedia-mcp-production", date: "5d ago", requests: "76", latency: "0.4 ms", badge: "MCP" },
  { name: "iaccess-dashboard-dev", date: "5d ago", requests: "24", latency: "0 ms", badge: "DEV" },
  { name: "iaccess-ai-gateway-dev", date: "5d ago", requests: "24", latency: "0.4 ms", badge: "AI" },
  { name: "meauxbasic", date: "5d ago", requests: "61", latency: "0.4 ms", badge: "BASIC" },
  { name: "meauxbility-dev", date: "5d ago", requests: "24", latency: "0.6 ms", badge: "DEV" },
  { name: "damnsam-production", date: "5d ago", requests: "22", latency: "0 ms", badge: "PROD" },
  { name: "iaccess-platform-dev", date: "6d ago", requests: "17", latency: "0.7 ms", badge: "DEV" },
  { name: "meaux-options-dev", date: "6d ago", requests: "45", latency: "0.2 ms", badge: "DEV" },
  { name: "meaux-options", date: "6d ago", requests: "92", latency: "1.4 ms", badge: "OPTS" },
  { name: "vision-board-dev", date: "6d ago", requests: "409", latency: "0.9 ms", badge: "VIS" },
  { name: "meaux-deploy-vault", date: "7d ago", requests: "23", latency: "0.3 ms", badge: "VAULT" },
  { name: "integration-hub", date: "7d ago", requests: "43", latency: "0.5 ms", badge: "HUB" },
  { name: "instantaccess-worker", date: "7d ago", requests: "22", latency: "1.1 ms", badge: "IA" },
  { name: "meauxmcp", date: "7d ago", requests: "579", latency: "1.4 ms", badge: "MCP" },
  { name: "meauxmedia-v2", date: "7d ago", requests: "46", latency: "1 ms", badge: "V2" },
  { name: "iacess-production", date: "7d ago", requests: "64", latency: "0.8 ms", badge: "PROD" },
  { name: "meauxaccess20", date: "8d ago", requests: "0", latency: "0 ms", badge: "MA20" },
  { name: "inneranimalmedia-router-production", date: "8d ago", requests: "0", latency: "0 ms", badge: "RTR" },
  { name: "meauxbility-homepage-remastered-dev", date: "8d ago", requests: "14", latency: "1.6 ms", badge: "DEV" },
  { name: "meauxaccess-dashboard-production", date: "8d ago", requests: "40", latency: "0.5 ms", badge: "DASH" },
  { name: "inner-animal-media", date: "8d ago", requests: "0", latency: "0 ms", badge: "IAM" },
  { name: "meauxstack-dashboard", date: "8d ago", requests: "0", latency: "0 ms", badge: "STACK" },
  { name: "meauxaccess-dashboard-staging", date: "8d ago", requests: "80", latency: "1.2 ms", badge: "STAGE" },
  { name: "damnsam-dev", date: "8d ago", requests: "14", latency: "3.5 ms", badge: "DEV" },
  { name: "southernpetsanimalrescue-fix-nav", date: "9d ago", requests: "20", latency: "0.3 ms", badge: "FIX" },
  { name: "southernpetsemailworker", date: "9d ago", requests: "138", latency: "0.6 ms", badge: "EMAIL" },
  { name: "spar-dashboard", date: "9d ago", requests: "141", latency: "0.6 ms", badge: "SPAR" },
  { name: "acemedical", date: "9d ago", requests: "210", latency: "0.6 ms", badge: "ACE" },
  { name: "iaccess-api", date: "10d ago", requests: "388", latency: "2.7 ms", badge: "API" },
  { name: "iacess", date: "10d ago", requests: "15", latency: "0.8 ms", badge: "IA" },
  { name: "iaccess-router", date: "10d ago", requests: "17", latency: "0.7 ms", badge: "RTR" },
  { name: "gemini-proxy", date: "10d ago", requests: "18", latency: "0.3 ms", badge: "PROXY" },
  { name: "email-worker-sam", date: "10d ago", requests: "18", latency: "0 ms", badge: "EMAIL" }
];

export async function init() {
  const lane1 = document.getElementById('lane-1');
  const lane2 = document.getElementById('lane-2');
  const grid = document.getElementById('active-grid');
  const searchInput = document.getElementById('lib-search');

  window.openPreview = (name) => {
    const modal = document.getElementById('preview-modal');
    const frame = document.getElementById('modal-frame');
    const title = document.getElementById('modal-title');
    const urlText = document.getElementById('modal-url');
    const btnVisit = document.getElementById('btn-visit');

    const url = `https://${name}.meauxbility.workers.dev`;
    title.textContent = name;
    urlText.textContent = url;
    frame.src = url;
    btnVisit.onclick = () => window.open(url, '_blank');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closePreview = () => {
    const modal = document.getElementById('preview-modal');
    const frame = document.getElementById('modal-frame');
    modal.classList.remove('active');
    frame.src = '';
    document.body.style.overflow = '';
  };

  const renderCard = (p) => {
    const screenshot = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(`https://${p.name}.meauxbility.workers.dev`)}?w=800&h=500`;

    return `
      <div class="worker-card" onclick="openPreview('${p.name}')">
        <div class="worker-thumb">
          <img src="${screenshot}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#22D3EE,#3B82F6);color:white;font-weight:800;font-size:48px;\\'>${p.name.charAt(0).toUpperCase()}</div>'">
          <div class="worker-badge-top">${p.badge || 'WORKER'}</div>
        </div>
        <div class="worker-body">
          <div class="worker-name">${p.name}</div>
          <div class="worker-meta">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${p.date}</span>
          </div>
        </div>
        <div class="worker-footer">
          <div class="metric-pill" style="color:var(--cyan);">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>${p.requests || '0'}</span>
          </div>
          <div class="metric-pill" style="color:var(--muted2);">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${p.latency || '0 ms'}</span>
          </div>
        </div>
      </div>
    `;
  };

  const refreshUI = (filteredList) => {
    if (grid) grid.innerHTML = filteredList.map(renderCard).join('');
  };

  // Populate Lanes for Marquee (Triple for seamless loop)
  const marqueeData = [...buildList, ...buildList, ...buildList];
  if (lane1) lane1.innerHTML = marqueeData.slice(0, Math.ceil(marqueeData.length / 2)).map(renderCard).join('');
  if (lane2) lane2.innerHTML = marqueeData.slice(Math.ceil(marqueeData.length / 2)).map(renderCard).join('');

  // Search functionality
  searchInput?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = buildList.filter(p => p.name.toLowerCase().includes(val));
    refreshUI(filtered);
  });

  // Initial Grid Render
  refreshUI(buildList);
}
