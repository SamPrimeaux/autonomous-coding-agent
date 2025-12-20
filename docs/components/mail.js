// Mail Component - Resend Powered Email Transmitter
export default function Mail() {
  return `
    <style>
      .mail-transmitter {
        max-width: 800px;
        margin: 40px auto;
        padding: 32px;
        background: var(--glass2);
        backdrop-filter: blur(40px);
        border: 1px solid var(--stroke);
        border-radius: 24px;
        box-shadow: var(--shadow);
        animation: fadeIn 0.5s ease;
      }

      .mail-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
      }

      .mail-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, var(--cyan), var(--blue));
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        font-size: 12px;
        font-weight: 700;
        color: var(--muted2);
        text-transform: uppercase;
        margin-bottom: 8px;
        letter-spacing: 0.05em;
      }

      .form-group input, .form-group textarea {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--stroke);
        border-radius: 12px;
        color: #fff;
        font-size: 14px;
        outline: none;
        transition: var(--transition);
      }

      .form-group input:focus, .form-group textarea:focus {
        border-color: var(--cyan);
        background: rgba(255,255,255,0.08);
      }

      .mail-status {
        margin-top: 20px;
        padding: 12px;
        border-radius: 10px;
        font-size: 13px;
        display: none;
      }

      .mail-status.success { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); display: block; }
      .mail-status.error { background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2); display: block; }
    </style>

    <div class="mail-transmitter">
      <div class="mail-header">
        <div class="mail-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </div>
        <div>
          <h2 style="margin:0; font-size:24px; color:#fff; font-weight:800;">Email Transmitter</h2>
          <p style="margin:0; font-size:13px; color:var(--muted);">Powered by Resend API • Edge Delivery</p>
        </div>
      </div>

      <div class="form-group">
        <label>Recipient Address</label>
        <input type="email" id="mail-to" placeholder="colleague@company.com">
      </div>

      <div class="form-group">
        <label>Subject</label>
        <input type="text" id="mail-subject" placeholder="Meeting Invite: FaceTime Chat">
      </div>

      <div class="form-group">
        <label>Message (HTML Supported)</label>
        <textarea id="mail-body" rows="6" placeholder="Greetings, I would like to invite you to a FaceTime chat..."></textarea>
      </div>

      <button id="send-btn" class="btn btn-primary" style="width:100%; padding:14px; font-weight:800;">Transmit Email</button>
      
      <div id="mail-status" class="mail-status"></div>
    </div>
  `;
}

export function init() {
  const sendBtn = document.getElementById('send-btn');
  const toInput = document.getElementById('mail-to');
  const subjectInput = document.getElementById('mail-subject');
  const bodyInput = document.getElementById('mail-body');
  const statusEl = document.getElementById('mail-status');

  sendBtn?.addEventListener('click', async () => {
    const to = toInput.value.trim();
    const subject = subjectInput.value.trim();
    const html = bodyInput.value.trim();

    if (!to || !subject || !html) {
      statusEl.textContent = 'All fields are required.';
      statusEl.className = 'mail-status error';
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Transmitting...';
    statusEl.style.display = 'none';

    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html })
      });

      const data = await res.json();
      if (res.ok) {
        statusEl.textContent = 'Transmission successful! Check your inbox.';
        statusEl.className = 'mail-status success';
        toInput.value = '';
        subjectInput.value = '';
        bodyInput.value = '';
      } else {
        throw new Error(data.error || 'Transmission failed.');
      }
    } catch (e) {
      statusEl.textContent = e.message;
      statusEl.className = 'mail-status error';
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Transmit Email';
    }
  });
}
