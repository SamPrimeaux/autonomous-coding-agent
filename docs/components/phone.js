// Phone Component for MeauxOS
export default function Phone() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">Phone</h1>
      <p class="page-subtitle">Twilio phone integration</p>
    </div>
    <div style="padding: 0; max-width: 1600px; margin: 0 auto;">
      <div class="card" style="padding: 24px; text-align: center;">
        <p style="color: var(--text-secondary); margin-bottom: 16px;">This page is ready for API connection.</p>
        <p style="font-size: 13px; color: var(--text-muted);">API Endpoint: <code>/api/meauxaccess/phone</code></p>
      </div>
    </div>
  `;
}

export function init() {
  async function loadData() {
    try {
      const response = await fetch('/api/meauxaccess/phone');
      if (response.ok) {
        const data = await response.json();
        console.log('Data loaded:', data);
      }
    } catch (error) {
      console.log('API not connected yet');
    }
  }
  loadData();
}
