// MeauxDesign Component - Media Management & Creation Hub
export default function MeauxDesign() {
    return `
    <style>
      .design-root {
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
        animation: fadeIn 0.5s ease;
      }

      .design-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }

      .media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .media-card {
        background: var(--glass2);
        backdrop-filter: blur(20px);
        border: 1px solid var(--stroke);
        border-radius: 20px;
        overflow: hidden;
        transition: var(--transition);
        position: relative;
      }

      .media-card:hover {
        transform: translateY(-5px);
        border-color: var(--cyan);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }

      .media-preview {
        width: 100%;
        aspect-ratio: 16/9;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .media-preview img, .media-preview video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .media-info {
        padding: 16px;
      }

      .media-title {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .media-meta {
        font-size: 11px;
        color: var(--muted2);
        display: flex;
        justify-content: space-between;
      }

      .media-actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: 0.2s;
      }

      .media-card:hover .media-actions {
        opacity: 1;
      }

      .action-icon {
        width: 32px;
        height: 32px;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
      }

      .action-icon:hover {
        background: var(--cyan);
        color: #000;
      }

      .upload-zone {
        border: 2px dashed var(--stroke);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        background: rgba(255,255,255,0.02);
        cursor: pointer;
        transition: 0.3s;
        margin-bottom: 32px;
      }

      .upload-zone:hover {
        border-color: var(--cyan);
        background: rgba(34, 211, 238, 0.05);
      }

      .filter-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
      }

      .filter-tab {
        padding: 8px 16px;
        background: var(--glass);
        border: 1px solid var(--stroke);
        border-radius: 10px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
      }

      .filter-tab.active {
        background: rgba(34, 211, 238, 0.15);
        color: var(--cyan);
        border-color: var(--cyan);
      }

      .stats-bar {
        display: flex;
        gap: 24px;
        background: var(--glass);
        padding: 16px 24px;
        border-radius: 16px;
        border: 1px solid var(--stroke);
        margin-bottom: 32px;
      }

      .stat-item {
        display: flex;
        flex-direction: column;
      }

      .stat-label {
        font-size: 10px;
        font-weight: 800;
        color: var(--muted2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-value {
        font-size: 18px;
        font-weight: 800;
        color: #fff;
      }
    </style>

    <div class="design-root">
      <div class="design-header">
        <div>
          <h1 style="margin:0; font-size:32px; font-weight:900; color:#fff; letter-spacing:-0.03em;">MeauxDesign</h1>
          <p style="margin:0; font-size:14px; color:var(--muted);">Media Creation & Orchestration Hub</p>
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-primary" id="create-btn">+ Create New</button>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-label">Videos Stored</span>
          <span class="stat-value" id="stat-videos">38</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Minutes Used</span>
          <span class="stat-value" id="stat-minutes">19 / 1,000</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">3D Assets</span>
          <span class="stat-value" id="stat-3d">12</span>
        </div>
      </div>

      <div class="upload-zone" id="upload-zone">
        <svg width="48" height="48" fill="none" stroke="var(--muted2)" style="margin-bottom:16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        <h3 style="color:#fff; margin:0 0 8px 0;">Transmit Media to Edge</h3>
        <p style="color:var(--muted2); font-size:13px; margin:0;">Drop Video, Pictures, or GLB models here</p>
      </div>

      <div class="filter-tabs">
        <div class="filter-tab active" data-type="all">All Media</div>
        <div class="filter-tab" data-type="video">Videos</div>
        <div class="filter-tab" data-type="image">Pictures</div>
        <div class="filter-tab" data-type="glb">3D Models</div>
      </div>

      <div class="media-grid" id="media-grid">
        <!-- Live Stream & R2 Assets will populate here -->
        <div class="loading">Syncing with Cloudflare Stream...</div>
      </div>
    </div>
  `;
}

export async function init() {
    const mediaGrid = document.getElementById('media-grid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const uploadZone = document.getElementById('upload-zone');

    let mediaAssets = [];

    async function fetchStreamVideos() {
        try {
            const res = await fetch('/api/stream/videos');
            const data = await res.json();
            if (data.success) {
                return data.result.map(v => ({
                    id: v.uid,
                    title: v.meta.name || 'Untitled Video',
                    type: 'video',
                    preview: v.thumbnail,
                    created: new Date(v.created).toLocaleDateString(),
                    duration: Math.round(v.duration) + 's',
                    status: v.status.state
                }));
            }
        } catch (e) {
            console.error('Failed to fetch stream videos', e);
        }
        return [];
    }

    async function renderMedia(filter = 'all') {
        mediaGrid.innerHTML = '<div class="loading">Orchestrating assets...</div>';

        const streamVideos = await fetchStreamVideos();
        // Add some dummy data for pictures and GLB if live R2 listing isn't implemented
        const dummyAssets = [
            { id: 'img1', title: 'Cyber-Bike Concept', type: 'image', preview: 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/49029798-3a1d-41c0-bcf5-3164a155bc00/avatar', created: '1 day ago' },
            { id: 'glb1', title: 'MeauxOS Logo 3D', type: 'glb', preview: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video/flower.webm', created: '2 days ago' }
        ];

        mediaAssets = [...streamVideos, ...dummyAssets];

        const filtered = filter === 'all' ? mediaAssets : mediaAssets.filter(a => a.type === filter);

        if (filtered.length === 0) {
            mediaGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--muted2);">No assets found in this sector.</div>';
            return;
        }

        mediaGrid.innerHTML = filtered.map(asset => `
      <div class="media-card">
        <div class="media-preview">
          ${asset.type === 'video' ? `<img src="${asset.preview}" alt="${asset.title}">` : ''}
          ${asset.type === 'image' ? `<img src="${asset.preview}" alt="${asset.title}">` : ''}
          ${asset.type === 'glb' ? `<div style="font-size:40px;">🧊</div>` : ''}
          <div class="media-actions">
            <div class="action-icon" title="Edit">✎</div>
            <div class="action-icon" title="Download">↓</div>
            <div class="action-icon" title="Delete">✕</div>
          </div>
        </div>
        <div class="media-info">
          <div class="media-title">${asset.title}</div>
          <div class="media-meta">
            <span>${asset.created}</span>
            <span>${asset.type.toUpperCase()} ${asset.duration || ''}</span>
          </div>
        </div>
      </div>
    `).join('');
    }

    filterTabs.forEach(tab => {
        tab.onclick = () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderMedia(tab.dataset.type);
        };
    });

    uploadZone.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = async (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                alert(`Initializing transmit for ${files.length} files to Cloudflare Edge...`);
                // Implementation for TUS upload to Stream or R2 upload would go here
            }
        };
        input.click();
    };

    renderMedia();
}

