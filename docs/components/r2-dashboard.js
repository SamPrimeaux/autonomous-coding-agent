// R2 Dashboard Component - iOS-style Cloudflare R2 manager (vanilla JS, SPA compatible)

// Inline SVG icons by category
const ICONS = {
  media: (id = 'g-media') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#EC4899"/>
        </linearGradient>
      </defs>
      <rect x="10" y="14" width="44" height="36" rx="8" fill="url(#${id})" opacity="0.95"/>
      <circle cx="24" cy="30" r="6" fill="#fff" opacity="0.95"/>
      <path d="M20 44l10-12 8 10 6-8 8 10H20z" fill="#fff" opacity="0.95"/>
    </svg>
  `,
  brand: (id = 'g-brand') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0EA5E9"/>
          <stop offset="100%" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="40" height="40" rx="12" fill="url(#${id})" opacity="0.95"/>
      <path d="M24 40c0-8 4-12 8-12s8 4 8 12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="26" r="5" fill="#fff" opacity="0.95"/>
    </svg>
  `,
  code: (id = 'g-code') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981"/>
          <stop offset="100%" stop-color="#0EA5E9"/>
        </linearGradient>
      </defs>
      <rect x="10" y="14" width="44" height="36" rx="10" fill="url(#${id})" opacity="0.95"/>
      <path d="M26 24l-10 8 10 8M38 24l10 8-10 8M32 22l-4 20" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  document: (id = 'g-doc') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#FBBF24"/>
        </linearGradient>
      </defs>
      <path d="M18 12h20l8 8v28a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" fill="url(#${id})" opacity="0.95"/>
      <path d="M38 12v10a2 2 0 0 0 2 2h10" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 30h16M22 38h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  backup: (id = 'g-backup') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9CA3AF"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <rect x="12" y="14" width="40" height="36" rx="12" fill="url(#${id})" opacity="0.95"/>
      <path d="M24 32a8 8 0 1 1 16 0v4a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4v-4z" stroke="#fff" stroke-width="3" fill="none"/>
      <path d="M32 20v4M28 44v-4M36 44v-4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  personal: (id = 'g-personal') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366F1"/>
          <stop offset="100%" stop-color="#A855F7"/>
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="40" height="40" rx="12" fill="url(#${id})" opacity="0.95"/>
      <circle cx="32" cy="26" r="7" fill="#fff" opacity="0.95"/>
      <path d="M22 44c1.6-5 5.6-8 10-8s8.4 3 10 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  client: (id = 'g-client') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F97316"/>
          <stop offset="100%" stop-color="#EF4444"/>
        </linearGradient>
      </defs>
      <rect x="12" y="14" width="40" height="36" rx="12" fill="url(#${id})" opacity="0.95"/>
      <rect x="20" y="22" width="24" height="12" rx="4" fill="#fff" opacity="0.95"/>
      <rect x="18" y="36" width="28" height="6" rx="3" fill="#fff" opacity="0.9"/>
      <rect x="22" y="44" width="20" height="4" rx="2" fill="#fff" opacity="0.8"/>
    </svg>
  `,
  trash: () => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="18" y="18" width="28" height="36" rx="8" fill="#EF4444" opacity="0.95"/>
      <rect x="16" y="16" width="32" height="6" rx="3" fill="#B91C1C"/>
      <path d="M26 26v20M32 26v20M38 26v20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  folder: (id = 'g-folder') => `
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9CA3AF"/>
          <stop offset="100%" stop-color="#6B7280"/>
        </linearGradient>
      </defs>
      <path d="M10 20a6 6 0 0 1 6-6h10l4 4h18a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V20z" fill="url(#${id})" opacity="0.95"/>
    </svg>
  `
};

const CATEGORY_RULES = [
  { key: 'media', label: 'Media & Assets', gradient: 'from-purple-500 to-pink-500', match: /(media|photo|film|video|image|assets|recordings|models|icons)/i },
  { key: 'brand', label: 'Brand Assets', gradient: 'from-sky-500 to-cyan-400', match: /(brand|logo|palette|style|meauxbility|inneranimal|inneranimals)/i },
  { key: 'code', label: 'Development', gradient: 'from-emerald-500 to-teal-400', match: /(build|deploy|staging|prod|workflow|dev|worker|stack|scripts|components)/i },
  { key: 'document', label: 'Documents', gradient: 'from-amber-500 to-yellow-400', match: /(docs|grant|ebook|content|writing|org)/i },
  { key: 'backup', label: 'Archives', gradient: 'from-slate-500 to-gray-500', match: /(backup|secret|vault|sync|archive|storage)/i },
  { key: 'personal', label: 'Personal', gradient: 'from-indigo-500 to-purple-500', match: /(sam|primeaux|personal)/i },
  { key: 'client', label: 'Client Work', gradient: 'from-orange-500 to-rose-500', match: /(acemedical|blairmann|connor|fred|southernpets|spar|amber|evergreen|client|dashboard)/i },
  { key: 'trash', label: 'Trash', gradient: 'from-red-600 to-red-700', match: /(trash|bin)/i }
];

function categorizeBucket(name = '') {
  const rule = CATEGORY_RULES.find(r => r.match.test(name));
  return rule || { key: 'folder', label: 'Uncategorized', gradient: 'from-gray-400 to-gray-500' };
}

function formatBytes(bytes = 0) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const num = bytes / Math.pow(k, i);
  return `${num.toFixed(num >= 10 ? 0 : 2)} ${units[i]}`;
}

function formatNumber(n = 0) {
  return Intl.NumberFormat('en-US').format(n);
}

function relativeTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// Ripple helper
function applyRipple(el) {
  el.addEventListener('click', (e) => {
    const circle = document.createElement('span');
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - el.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - el.getBoundingClientRect().top - radius}px`;
    circle.classList.add('r2-ripple');
    const ripple = el.getElementsByClassName('r2-ripple')[0];
    if (ripple) ripple.remove();
    el.appendChild(circle);
  });
}

function buildStyles() {
  return `
    <style>
      :root {
        --ios-blue: #007AFF;
        --ios-gray: #F2F2F7;
        --ios-separator: #C6C6C8;
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --card-bg: rgba(255, 255, 255, 0.85);
        --glass: rgba(255, 255, 255, 0.80);
        --shadow-card: 0 8px 24px rgba(15, 23, 42, 0.08);
        --shadow-strong: 0 18px 44px rgba(15, 23, 42, 0.14);
      }
      .r2-dashboard {
        font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%);
        color: var(--text-primary);
        min-height: 100vh;
        padding: 24px;
        box-sizing: border-box;
      }
      .r2-header {
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(16px);
        background: rgba(255,255,255,0.85);
        border-bottom: 1px solid #e2e8f0;
        padding: 16px 0 12px;
      }
      .r2-title {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.01em;
        margin: 0;
        color: #0f172a;
      }
      .r2-top-row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .r2-search {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--glass);
        border: 1px solid #e2e8f0;
        padding: 10px 14px;
        border-radius: 14px;
        box-shadow: var(--shadow-card);
      }
      .r2-search input {
        border: none;
        background: transparent;
        width: 100%;
        font-size: 15px;
        outline: none;
      }
      .r2-chip-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .r2-chip {
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        background: rgba(255,255,255,0.9);
        font-weight: 600;
        font-size: 13px;
        color: #0f172a;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .r2-chip.active {
        background: var(--ios-blue);
        color: white;
        border-color: var(--ios-blue);
      }
      .r2-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin: 16px 0 12px;
      }
      .r2-stat-card {
        background: var(--glass);
        border-radius: 16px;
        padding: 14px;
        border: 1px solid #e2e8f0;
        box-shadow: var(--shadow-card);
      }
      .r2-stat-label {
        font-size: 13px;
        color: var(--text-secondary);
        margin-bottom: 4px;
      }
      .r2-stat-value {
        font-size: 22px;
        font-weight: 700;
      }
      .r2-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-top: 8px;
      }
      .r2-card {
        position: relative;
        padding: 20px;
        border-radius: 20px;
        background: var(--card-bg);
        border: 1px solid #e2e8f0;
        box-shadow: var(--shadow-card);
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        cursor: pointer;
        outline: none;
      }
      .r2-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-strong);
      }
      .r2-card:focus-visible,
      .r2-dotbtn:focus-visible,
      .r2-chip:focus-visible,
      .r2-menu button:focus-visible {
        outline: 2px solid var(--ios-blue);
        outline-offset: 2px;
      }
      .r2-card .icon {
        width: 64px;
        height: 64px;
        margin-bottom: 12px;
      }
      .r2-card h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }
      .r2-card .meta {
        margin-top: 6px;
        color: var(--text-secondary);
        font-size: 14px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .r2-progress {
        width: 100%;
        height: 6px;
        background: #e2e8f0;
        border-radius: 999px;
        margin: 12px 0 6px;
        overflow: hidden;
      }
      .r2-progress span {
        display: block;
        height: 100%;
        width: 30%;
        background: linear-gradient(90deg, #0ea5e9, #22c55e);
        border-radius: 999px;
        transition: width 0.3s ease;
      }
      .r2-actions {
        position: absolute;
        top: 14px;
        right: 14px;
      }
      .r2-dotbtn {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1px solid #e2e8f0;
        background: rgba(255,255,255,0.9);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .r2-dotbtn:hover {
        box-shadow: var(--shadow-card);
        transform: translateY(-1px);
      }
      .r2-menu {
        position: absolute;
        top: 44px;
        right: 0;
        width: 200px;
        background: white;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        box-shadow: var(--shadow-strong);
        padding: 6px;
        display: none;
      }
      .r2-menu.open {
        display: block;
      }
      .r2-menu button {
        width: 100%;
        background: transparent;
        border: none;
        padding: 10px 12px;
        border-radius: 10px;
        text-align: left;
        font-weight: 600;
        color: #0f172a;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .r2-menu button:hover {
        background: #f8fafc;
      }
      .r2-section {
        margin: 22px 0;
      }
      .r2-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 14px;
        background: rgba(255,255,255,0.85);
        border: 1px solid #e2e8f0;
      }
      .r2-section-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
      }
      .r2-section-count {
        color: var(--text-secondary);
        font-size: 13px;
      }
      .r2-section-content {
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      .r2-empty {
        background: rgba(255,255,255,0.9);
        border: 1px dashed #cbd5e1;
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        color: var(--text-secondary);
      }
      .r2-detail {
        position: fixed;
        top: 0;
        right: -460px;
        width: 400px;
        height: 100vh;
        background: rgba(255,255,255,0.97);
        box-shadow: -12px 0 32px rgba(15,23,42,0.15);
        padding: 20px;
        z-index: 50;
        transition: right 0.3s ease;
        overflow-y: auto;
      }
      .r2-detail.open {
        right: 0;
      }
      .r2-detail h3 {
        margin: 0 0 8px;
      }
      .r2-detail table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      .r2-detail table td {
        padding: 6px 4px;
        color: var(--text-secondary);
      }
      .r2-objects {
        margin-top: 14px;
      }
      .r2-object-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 14px;
      }
      .r2-toast {
        position: fixed;
        top: 16px;
        right: 16px;
        padding: 12px 14px;
        border-radius: 12px;
        color: #fff;
        background: #22c55e;
        box-shadow: var(--shadow-strong);
        display: none;
        z-index: 60;
      }
      .r2-toast.error { background: #ef4444; }
      .r2-toast.info { background: #0ea5e9; }
      .r2-usage {
        background: var(--glass);
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 16px;
        box-shadow: var(--shadow-card);
        margin: 10px 0 20px;
      }
      @media (max-width: 768px) {
        .r2-dashboard { padding: 16px; }
        .r2-grid { grid-template-columns: 1fr; }
        .r2-header { top: -6px; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }
      }
      /* Ripple */
      .r2-ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: r2-ripple 600ms linear;
        background-color: rgba(0, 122, 255, 0.25);
        pointer-events: none;
      }
      @keyframes r2-ripple {
        to { transform: scale(3); opacity: 0; }
      }
    </style>
  `;
}

function bucketCardTemplate(bucket) {
  const iconId = `grad-${bucket.name.replace(/[^a-z0-9]/gi, '')}`;
  const progress = Math.min(100, Math.max(6, (bucket.sizeBytes / (1024 * 1024 * 500)) * 100)); // approx vs 500MB threshold
  const objects = bucket.objects ?? 0;
  const size = bucket.size ?? formatBytes(bucket.sizeBytes || 0);
  const last = bucket.lastModified ? relativeTime(bucket.lastModified) : '—';
  const icon = (ICONS[bucket.category.key] || ICONS.folder)(iconId);
  return `
    <article class="r2-card" data-bucket="${bucket.name}">
      <div class="icon">${icon}</div>
      <h3>${bucket.name}</h3>
      <div class="meta">
        <span>${objects} items</span>
        <span>${size}</span>
        <span>${last}</span>
      </div>
      <div class="r2-progress"><span style="width:${progress}%"></span></div>
      <div class="meta">Usage ~${progress.toFixed(0)}%</div>
      <div class="r2-actions">
        <button class="r2-dotbtn" aria-label="Open menu">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="2" fill="#0f172a"/>
            <circle cx="10" cy="10" r="2" fill="#0f172a"/>
            <circle cx="16" cy="10" r="2" fill="#0f172a"/>
          </svg>
        </button>
        <div class="r2-menu">
          <button data-action="open">Open bucket</button>
          <button data-action="copy">Copy S3 URL</button>
          <button data-action="analytics">View analytics</button>
          <button data-action="access">Configure access</button>
          <button data-action="metadata">Download metadata</button>
          <button data-action="trash">Move to trash</button>
        </div>
      </div>
    </article>
  `;
}

function sectionTemplate(category, buckets) {
  return `
    <section class="r2-section" data-category="${category.key}">
      <div class="r2-section-header">
        <div class="r2-section-title">
          <span>${category.label}</span>
          <span class="r2-section-count">${buckets.length} buckets</span>
        </div>
        <div class="chevron">▼</div>
      </div>
      <div class="r2-section-content">
        ${buckets.length === 0 ? `<div class="r2-empty">No buckets in this category</div>` : `<div class="r2-grid">${buckets.map(bucketCardTemplate).join('')}</div>`}
      </div>
    </section>
  `;
}

function layoutTemplate() {
  return `
    ${buildStyles()}
    <div class="r2-dashboard">
      <header class="r2-header">
        <div class="r2-top-row">
          <div>
            <p class="r2-stat-label" style="margin:0;">Storage</p>
            <h1 class="r2-title">R2 Storage</h1>
          </div>
          <div class="r2-search">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#475569" stroke-width="2"/>
              <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input id="r2-search" placeholder="Search buckets..." />
          </div>
        </div>
        <div class="r2-chip-row" id="r2-filters">
          ${['All', 'Active', 'Clients', 'Media', 'Dev', 'Archive', 'Personal', 'Trash'].map((label, idx) => `<button class="r2-chip ${idx === 0 ? 'active' : ''}" data-filter="${label.toLowerCase()}">${label}</button>`).join('')}
        </div>
        <div class="r2-stats">
          <div class="r2-stat-card">
            <div class="r2-stat-label">Total Storage</div>
            <div class="r2-stat-value" id="r2-total-size">—</div>
          </div>
          <div class="r2-stat-card">
            <div class="r2-stat-label">Buckets</div>
            <div class="r2-stat-value" id="r2-total-buckets">—</div>
          </div>
          <div class="r2-stat-card">
            <div class="r2-stat-label">Objects</div>
            <div class="r2-stat-value" id="r2-total-objects">—</div>
          </div>
          <div class="r2-stat-card">
            <div class="r2-stat-label">Class A Ops</div>
            <div class="r2-stat-value">8.15k</div>
          </div>
        </div>
      </header>

      <div class="r2-usage" id="r2-usage">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div class="r2-stat-label">Usage Overview</div>
            <div class="r2-stat-value" style="font-size:18px;">Dec 1 - Dec 11</div>
          </div>
          <button class="r2-chip" id="r2-toggle-usage">Collapse</button>
        </div>
        <div id="r2-usage-body" style="margin-top:12px; display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
          <div>
            <div class="r2-stat-label">Class A Operations</div>
            <div class="r2-stat-value" style="font-size:18px;">8.15k</div>
          </div>
          <div>
            <div class="r2-stat-label">Class B Operations</div>
            <div class="r2-stat-value" style="font-size:18px;">47.47k</div>
          </div>
          <div>
            <div class="r2-stat-label">Total Storage</div>
            <div class="r2-stat-value" style="font-size:18px;">913.07 MB</div>
          </div>
          <div>
            <div class="r2-stat-label">Account</div>
            <div style="font-size:14px; color:var(--text-secondary);">
              API Token: <span id="r2-token" data-masked="************">************</span>
              <button class="r2-chip" style="margin-left:6px;" id="r2-reveal">Reveal</button><br/>
              Account ID: <span id="r2-account">ede6590ac0d2fb7daf155b35653457b2</span>
            </div>
          </div>
        </div>
      </div>

      <div id="r2-sections"></div>
      <div id="r2-loading" class="r2-empty" style="display:none; margin-top:12px;">Loading buckets...</div>
    </div>
    <div class="r2-detail" id="r2-detail"></div>
    <div class="r2-toast" id="r2-toast"></div>
  `;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
}

async function fetchBuckets() {
  const data = await fetchJSON('/api/r2/buckets');
  const list = data.buckets || data.result || [];
  return list.map((b, idx) => {
    const category = categorizeBucket(b.name || `bucket-${idx}`);
    return {
      name: b.name || `bucket-${idx}`,
      objects: b.objects ?? b.object_count ?? 0,
      size: b.size || (b.size_bytes ? formatBytes(b.size_bytes) : undefined),
      sizeBytes: b.size_bytes ?? 0,
      lastModified: b.last_modified || b.creation_date,
      category
    };
  });
}

async function fetchBucketDetail(name) {
  try {
    const stats = await fetchJSON(`/api/r2/buckets/${encodeURIComponent(name)}/stats`);
    const objects = await fetchJSON(`/api/r2/buckets/${encodeURIComponent(name)}/objects?limit=10`);
    return { stats, objects: objects.objects || [] };
  } catch (e) {
    return { stats: null, objects: [] };
  }
}

function renderSections(buckets, filter = 'all', search = '', limit = 40) {
  const container = document.getElementById('r2-sections');
  if (!container) return;
  const filtered = buckets.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    let matchesFilter = true;
    if (filter === 'clients') matchesFilter = b.category.key === 'client';
    else if (filter === 'media') matchesFilter = b.category.key === 'media';
    else if (filter === 'dev') matchesFilter = b.category.key === 'code';
    else if (filter === 'archive') matchesFilter = b.category.key === 'backup';
    else if (filter === 'personal') matchesFilter = b.category.key === 'personal';
    else if (filter === 'trash') matchesFilter = b.category.key === 'trash';
    return matchesSearch && matchesFilter;
  });

  const grouped = CATEGORY_RULES.concat({ key: 'trash', label: 'Trash' }, { key: 'folder', label: 'Uncategorized' }).reduce((acc, rule) => {
    acc[rule.key] = [];
    return acc;
  }, {});
  filtered.slice(0, limit).forEach(b => {
    const key = b.category.key || 'folder';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  });

  const order = [
    { key: 'brand', label: 'Active Projects' },
    { key: 'client', label: 'Client Work' },
    { key: 'media', label: 'Media & Assets' },
    { key: 'code', label: 'Development' },
    { key: 'backup', label: 'Archives' },
    { key: 'personal', label: 'Personal' },
    { key: 'trash', label: 'Trash' },
    { key: 'folder', label: 'Other' }
  ];

  container.innerHTML = order.map(({ key, label }) => {
    return sectionTemplate({ key, label }, grouped[key] || []);
  }).join('');

  container.querySelectorAll('.r2-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const open = content.style.maxHeight;
      if (open) {
        content.style.maxHeight = null;
        header.querySelector('.chevron').style.transform = 'rotate(0deg)';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        header.querySelector('.chevron').style.transform = 'rotate(180deg)';
      }
    });
  });

  // Initialize card interactions
  container.querySelectorAll('.r2-card').forEach(card => {
    applyRipple(card);
    card.addEventListener('click', (e) => {
      if (e.target.closest('.r2-dotbtn') || e.target.closest('.r2-menu')) return;
      const name = card.dataset.bucket;
      openDetail(name);
    });
    const menuBtn = card.querySelector('.r2-dotbtn');
    const menu = card.querySelector('.r2-menu');
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.r2-menu').forEach(m => m.classList.remove('open'));
      menu.classList.toggle('open');
      const close = (ev) => {
        if (!menu.contains(ev.target) && ev.target !== menuBtn) {
          menu.classList.remove('open');
          document.removeEventListener('click', close);
        }
      };
      document.addEventListener('click', close);
    });
    menu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'copy') {
          navigator.clipboard.writeText(`https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com/${card.dataset.bucket}`);
          showToast('Copied S3 URL', 'info');
        } else {
          showToast(`Action: ${action}`, 'info');
        }
        menu.classList.remove('open');
      });
    });
  });
}

async function openDetail(name) {
  const panel = document.getElementById('r2-detail');
  if (!panel) return;
  panel.innerHTML = `<div class="r2-stat-label">Loading ${name}...</div>`;
  panel.classList.add('open');
  const { stats, objects } = await fetchBucketDetail(name);
  const rows = objects.map(obj => `
    <div class="r2-object-row">
      <div>${obj.key || obj.name || 'object'}</div>
      <div>${formatBytes(obj.size || obj.size_bytes || 0)}</div>
    </div>
  `).join('') || '<div class="r2-object-row">No recent objects</div>';
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <h3>${name}</h3>
      <button class="r2-dotbtn" aria-label="Close detail" id="r2-detail-close">✕</button>
    </div>
    <table>
      <tr><td>Objects</td><td>${stats?.objects ?? '—'}</td></tr>
      <tr><td>Size</td><td>${formatBytes(stats?.size_bytes || 0)}</td></tr>
      <tr><td>Created</td><td>${stats?.created_at ? new Date(stats.created_at).toLocaleDateString() : '—'}</td></tr>
      <tr><td>Region</td><td>${stats?.region || 'WNAM'}</td></tr>
    </table>
    <div class="r2-objects">${rows}</div>
    <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
      <button class="r2-chip">Upload</button>
      <button class="r2-chip">Download all</button>
      <button class="r2-chip">Configure CORS</button>
      <button class="r2-chip">Presigned URL</button>
    </div>
  `;
  panel.querySelector('#r2-detail-close').addEventListener('click', () => panel.classList.remove('open'));
}

function showToast(msg, type = 'info') {
  const toast = document.getElementById('r2-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `r2-toast ${type}`;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

async function initR2Dashboard() {
  const root = document.getElementById('r2-dashboard-view');
  if (!root) return;
  root.innerHTML = layoutTemplate();

  let buckets = [];
  const loadingEl = document.getElementById('r2-loading');
  if (loadingEl) loadingEl.style.display = 'block';
  try {
    buckets = await fetchBuckets();
  } catch (e) {
    showToast('Failed to load buckets', 'error');
  }
  if (loadingEl) loadingEl.style.display = 'none';

  // stats
  const totalSize = buckets.reduce((s, b) => s + (b.sizeBytes || 0), 0);
  const totalObjects = buckets.reduce((s, b) => s + (b.objects || 0), 0);
  const totalBuckets = buckets.length;
  document.getElementById('r2-total-size').textContent = formatBytes(totalSize);
  document.getElementById('r2-total-objects').textContent = formatNumber(totalObjects);
  document.getElementById('r2-total-buckets').textContent = totalBuckets;

  let searchTerm = '';
  let filter = 'all';
  let limit = 40;
  renderSections(buckets, filter, searchTerm, limit);

  // search
  const searchInput = document.getElementById('r2-search');
  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const val = e.target.value || '';
    searchTimer = setTimeout(() => {
      searchTerm = val;
      renderSections(buckets, filter, searchTerm, limit);
    }, 300);
  });

  // filters
  document.querySelectorAll('#r2-filters .r2-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#r2-filters .r2-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filter = chip.dataset.filter;
      renderSections(buckets, filter, searchTerm, limit);
    });
  });

  // usage collapse
  const usageBtn = document.getElementById('r2-toggle-usage');
  const usageBody = document.getElementById('r2-usage-body');
  usageBtn.addEventListener('click', () => {
    const isHidden = usageBody.style.display === 'none';
    usageBody.style.display = isHidden ? 'grid' : 'none';
    usageBtn.textContent = isHidden ? 'Collapse' : 'Expand';
  });

  // Infinite scroll (load more in chunks)
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      const nextLimit = limit + 20;
      if (nextLimit !== limit) {
        limit = nextLimit;
        renderSections(buckets, filter, searchTerm, limit);
      }
    }
  });
}

export default function R2Dashboard() {
  return `<div id="r2-dashboard-root"></div>`;
}

export function init() {
  initR2Dashboard();
}
