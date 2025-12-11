// Gallery view: list images/videos across buckets with pagination and search
export default function Gallery() {
  return `
    <style>
      .gal-wrap { padding:20px; font-family:'Inter', sans-serif; color:#0f172a; }
      .gal-toolbar { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
      .gal-select, .gal-input { padding:8px 10px; border-radius:10px; border:1px solid #e2e8f0; }
      .gal-grid { display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
      .gal-card { border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; box-shadow:0 10px 30px rgba(15,23,42,0.08); }
      .gal-thumb { position:relative; aspect-ratio: 1; background:#f1f5f9; display:flex; align-items:center; justify-content:center; overflow:hidden; }
      .gal-thumb img, .gal-thumb video { width:100%; height:100%; object-fit:cover; }
      .gal-meta { padding:10px; font-size:12px; color:#475569; }
      .gal-actions { display:flex; gap:8px; padding:8px 10px 12px; }
      .gal-btn { padding:6px 8px; border-radius:8px; border:1px solid #e2e8f0; background:#f8fafc; cursor:pointer; font-weight:600; }
      .pager { display:flex; gap:8px; margin-top:10px; }
    </style>
    <div class="gal-wrap">
      <h2 style="margin:0 0 6px;">Gallery</h2>
      <p style="margin:0 0 10px; color:#475569;">Browse images/videos from R2. Thumbnails for quick review.</p>
      <div class="gal-toolbar">
        <select id="gal-bucket" class="gal-select"></select>
        <select id="gal-type" class="gal-select">
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <input id="gal-search" class="gal-input" placeholder="Search objects..." />
        <button id="gal-refresh" class="gal-btn">Refresh</button>
      </div>
      <div id="gal-grid" class="gal-grid"></div>
      <div class="pager">
        <button id="gal-prev" class="gal-btn">Prev</button>
        <span id="gal-page" style="font-size:12px; color:#475569;">1</span>
        <button id="gal-next" class="gal-btn">Next</button>
      </div>
    </div>
  `;
}

export function init() {
  initGallery();
}

async function initGallery() {
  const bucketSelect = document.getElementById('gal-bucket');
  const typeSelect = document.getElementById('gal-type');
  const searchInput = document.getElementById('gal-search');
  const refreshBtn = document.getElementById('gal-refresh');
  const grid = document.getElementById('gal-grid');
  const pageEl = document.getElementById('gal-page');
  const prevBtn = document.getElementById('gal-prev');
  const nextBtn = document.getElementById('gal-next');
  if (!bucketSelect || !grid) return;

  let buckets = [];
  let objects = [];
  let page = 1;
  const pageSize = 30;

  const loadBuckets = async () => {
    const data = await fetchJSON('/api/r2/buckets');
    buckets = data.buckets || data.result || [];
    bucketSelect.innerHTML = buckets.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
    if (buckets[0]) {
      bucketSelect.value = buckets[0].name;
      await loadObjects();
    }
  };

  const loadObjects = async () => {
    const bucket = bucketSelect.value;
    if (!bucket) return;
    const data = await fetchJSON(`/api/r2/buckets/${encodeURIComponent(bucket)}/objects?limit=500`);
    objects = data.objects || [];
    page = 1;
    render();
  };

  const render = () => {
    const typeFilter = typeSelect.value;
    const query = (searchInput.value || '').toLowerCase();
    const filtered = objects.filter(o => {
      const key = o.key || '';
      const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(key);
      const isVideo = /\.(mp4|mov|webm|avi|mkv)$/i.test(key);
      if (typeFilter === 'image' && !isImage) return false;
      if (typeFilter === 'video' && !isVideo) return false;
      return key.toLowerCase().includes(query);
    });
    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);
    grid.innerHTML = pageItems.map(o => thumbCard(bucketSelect.value, o)).join('') || '<div>No objects.</div>';
    pageEl.textContent = `${page} / ${Math.max(1, Math.ceil(filtered.length / pageSize))}`;
  };

  const thumbCard = (bucket, obj) => {
    const key = obj.key || '';
    const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(key);
    const isVideo = /\.(mp4|mov|webm|avi|mkv)$/i.test(key);
    const url = `https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com/${bucket}/${encodeURIComponent(key)}`;
    return `
      <div class="gal-card">
        <div class="gal-thumb">
          ${isImage ? `<img src="${url}" alt="${key}" loading="lazy"/>` : isVideo ? `<video src="${url}" preload="metadata"></video>` : `<span style="color:#94a3b8;">${key.split('.').pop() || 'file'}</span>`}
        </div>
        <div class="gal-meta">
          <div style="font-weight:700; color:#0f172a; overflow:hidden; text-overflow:ellipsis;">${key}</div>
          <div>${formatBytes(obj.size || obj.size_bytes || 0)} � ${obj.uploaded ? new Date(obj.uploaded).toLocaleString() : ''}</div>
        </div>
      </div>
    `;
  };

  bucketSelect.addEventListener('change', loadObjects);
  typeSelect.addEventListener('change', render);
  searchInput.addEventListener('input', () => { page = 1; render(); });
  refreshBtn.addEventListener('click', loadObjects);
  prevBtn.addEventListener('click', () => { if (page > 1) { page--; render(); } });
  nextBtn.addEventListener('click', () => { page++; render(); });

  await loadBuckets();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

function formatBytes(bytes = 0) { if (bytes === 0) return '0 B'; const k = 1024; const units = ['B', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); const num = bytes / Math.pow(k, i); return `${num.toFixed(num >= 10 ? 0 : 2)} ${units[i]}`; }
