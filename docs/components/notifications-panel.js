// Notifications Panel Component for MeauxOS
export default function NotificationsPanel() {
  return `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 class="page-title">Notifications</h1>
      <p class="page-subtitle">Stay updated with your latest activity</p>
    </div>
    <div class="notifications-page" data-theme="light" style="padding: 0;">
      <style>
        .notifications-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: calc(100vh - 72px); padding: 32px 16px; display: flex; justify-content: center; }
        .notifications-panel { position: relative; width: 100%; max-width: 520px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden; display: flex; flex-direction: column; max-height: 680px; }
        .notifications-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); position: sticky; top: 0; z-index: 10; }
        .notifications-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
        .notifications-count { padding: 2px 8px; background: var(--danger, #EF4444); color: white; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .notifications-actions { display: flex; align-items: center; gap: 8px; }
        .icon-button { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; transition: all 150ms ease; border: none; background: transparent; color: var(--text-secondary); }
        .icon-button:hover { background: var(--bg-hover); color: var(--text-primary); }
        .notifications-tabs { display: flex; border-bottom: 1px solid var(--border); background: var(--bg-secondary); position: sticky; top: 64px; z-index: 9; }
        .notifications-tab { flex: 1; padding: 12px; background: transparent; border: none; border-bottom: 2px solid transparent; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 150ms ease; font-family: inherit; }
        .notifications-tab:hover { color: var(--text-primary); background: var(--bg-hover); }
        .notifications-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
        .notifications-list { flex: 1; overflow-y: auto; }
        .notifications-list::-webkit-scrollbar { width: 8px; }
        .notifications-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .notification-item { padding: 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 150ms ease; position: relative; display: flex; gap: 12px; background: var(--bg-primary); }
        .notification-item:hover { background: var(--bg-hover); }
        .notification-item.unread { background: rgba(31, 151, 169, 0.08); }
        .notification-item.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--primary); }
        .notification-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem; background: var(--bg-secondary); }
        .notification-icon.info { background: rgba(59, 130, 246, 0.1); color: #60A5FA; }
        .notification-icon.success { background: rgba(16, 185, 129, 0.1); color: #10B981; }
        .notification-icon.warning { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
        .notification-icon.error { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
        .notification-content { flex: 1; min-width: 0; }
        .notification-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
        .notification-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; }
        .notification-time { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
        .notification-message { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; }
        .notification-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .notification-action { padding: 6px 12px; background: transparent; border: 1px solid var(--border); border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 150ms ease; font-family: inherit; }
        .notification-action:hover { background: var(--bg-hover); border-color: var(--border-hover); color: var(--text-primary); }
        .notification-action.primary { background: var(--primary); border-color: var(--primary); color: white; }
        .notification-action.primary:hover { background: var(--primary-hover, #26B4C9); }
        .notifications-empty { padding: 48px; text-align: center; color: var(--text-secondary); }
        .notifications-empty-icon { width: 64px; height: 64px; margin: 0 auto 16px; color: var(--text-muted); }
        .notifications-empty-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
        .notifications-empty-description { font-size: 0.875rem; color: var(--text-secondary); }
        .notifications-footer { padding: 12px; border-top: 1px solid var(--border); background: var(--bg-secondary); }
        .notifications-footer-link { display: block; text-align: center; font-size: 0.875rem; font-weight: 600; color: var(--primary); text-decoration: none; padding: 8px; border-radius: 8px; transition: all 150ms ease; }
        .notifications-footer-link:hover { background: rgba(31, 151, 169, 0.1); }
        .demo-controls { position: relative; margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; background: var(--bg-card); padding: 12px; border-radius: 12px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
        .demo-btn { padding: 10px 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 150ms ease; font-family: inherit; }
        .demo-btn:hover { background: var(--primary-hover, #26B4C9); }
        .demo-btn.secondary { background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border); }
        .demo-btn.secondary:hover { background: var(--bg-hover); }
        @media (max-width: 480px) { .notifications-panel { max-width: 100%; border-radius: 12px; max-height: 100vh; } }
      </style>

      <div class="notifications-panel">
        <div class="notifications-header">
          <div class="notifications-title">Notifications <span class="notifications-count" id="unreadCount">0</span></div>
          <div class="notifications-actions">
            <button class="icon-button" id="markAllReadBtn" title="Mark all as read">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </button>
            <button class="icon-button" id="settingsBtn" title="Notification settings">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </div>

        <div class="notifications-tabs">
          <button class="notifications-tab active" data-tab="all">All</button>
          <button class="notifications-tab" data-tab="unread">Unread</button>
          <button class="notifications-tab" data-tab="mentions">Mentions</button>
        </div>

        <div class="notifications-list" id="notificationsList"></div>

        <div class="notifications-footer">
          <a href="#" class="notifications-footer-link" id="viewAllLink">View all notifications</a>
        </div>
      </div>

      <div class="demo-controls">
        <button class="demo-btn" id="addNotificationBtn">Add Notification</button>
        <button class="demo-btn secondary" id="clearAllBtn">Clear All</button>
        <button class="demo-btn secondary" id="themeToggleNotifications">Toggle Theme</button>
      </div>
    </div>
  `;
}

export function init() {
  let notifications = [
    { id: '1', type: 'info', icon: 'ℹ️', title: 'New project assigned', message: 'You have been assigned to "Website Redesign" project', time: '2 minutes ago', unread: true, actions: [{ label: 'View Project', primary: true }, { label: 'Dismiss', primary: false }] },
    { id: '2', type: 'success', icon: '✅', title: 'File uploaded successfully', message: 'Q4-Report.docx has been uploaded to MeauxCloud', time: '15 minutes ago', unread: true, actions: [{ label: 'Open File', primary: true }] },
    { id: '3', type: 'warning', icon: '⚠️', title: 'Storage limit warning', message: 'You are using 85% of your storage quota (8.5 GB / 10 GB)', time: '1 hour ago', unread: true, actions: [{ label: 'Upgrade', primary: true }, { label: 'Manage Storage', primary: false }] },
    { id: '4', type: 'info', icon: '💬', title: 'New message from Sarah', message: 'Sarah Johnson mentioned you in #design-team', time: '2 hours ago', unread: false, mention: true, actions: [{ label: 'Reply', primary: true }] },
    { id: '5', type: 'success', icon: '🎉', title: 'Automation completed', message: 'Your "Weekly Report" automation has finished processing', time: '3 hours ago', unread: false, actions: [{ label: 'View Results', primary: true }] },
    { id: '6', type: 'info', icon: '📅', title: 'Meeting reminder', message: 'Team standup starts in 30 minutes', time: '5 hours ago', unread: false, actions: [{ label: 'Join Meeting', primary: true }, { label: 'Reschedule', primary: false }] },
    { id: '7', type: 'error', icon: '❌', title: 'Deployment failed', message: 'Build #145 failed due to test errors', time: 'Yesterday', unread: false, actions: [{ label: 'View Logs', primary: true }, { label: 'Retry', primary: false }] },
    { id: '8', type: 'info', icon: '👥', title: 'New team member', message: 'Alex Rodriguez has joined your workspace', time: '2 days ago', unread: false, actions: [{ label: 'View Profile', primary: true }] }
  ];

  let currentTab = 'all';

  const notificationsList = document.getElementById('notificationsList');
  const unreadCount = document.getElementById('unreadCount');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const viewAllLink = document.getElementById('viewAllLink');
  const tabs = document.querySelectorAll('.notifications-tab');
  const addNotificationBtn = document.getElementById('addNotificationBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const themeToggle = document.getElementById('themeToggleNotifications');

  function updateUnreadCount() {
    const count = notifications.filter(n => n.unread).length;
    if (unreadCount) { unreadCount.textContent = String(count); unreadCount.style.display = count > 0 ? 'block' : 'none'; }
  }

  function getFilteredNotifications() {
    if (currentTab === 'unread') return notifications.filter(n => n.unread);
    if (currentTab === 'mentions') return notifications.filter(n => n.mention);
    return notifications;
  }

  function renderNotifications() {
    const filtered = getFilteredNotifications();
    if (!filtered.length) {
      notificationsList.innerHTML = `
        <div class="notifications-empty">
          <svg class="notifications-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <div class="notifications-empty-title">${currentTab === 'unread' ? 'All caught up!' : currentTab === 'mentions' ? 'No mentions yet' : 'No notifications'}</div>
          <div class="notifications-empty-description">${currentTab === 'unread' ? 'You have no unread notifications' : currentTab === 'mentions' ? 'You have not been mentioned' : 'You have no notifications'}</div>
        </div>`;
      return;
    }

    notificationsList.innerHTML = filtered.map(notification => `
      <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
        <div class="notification-icon ${notification.type}">${notification.icon}</div>
        <div class="notification-content">
          <div class="notification-header">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-time">${notification.time}</div>
          </div>
          <div class="notification-message">${notification.message}</div>
          ${notification.actions ? `<div class="notification-actions">${notification.actions.map(action => `<button class="notification-action ${action.primary ? 'primary' : ''}" data-action="${action.label}">${action.label}</button>`).join('')}</div>` : ''}
        </div>
      </div>`).join('');

    document.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', (e) => { if (!e.target.classList.contains('notification-action')) { markAsRead(item.dataset.id); } });
    });
    document.querySelectorAll('.notification-action').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); handleAction(btn.closest('.notification-item')?.dataset.id, btn.dataset.action); });
    });
  }

  function markAsRead(id) { const n = notifications.find(n => n.id === id); if (n) { n.unread = false; updateUnreadCount(); renderNotifications(); } }
  function markAllAsRead() { notifications.forEach(n => n.unread = false); updateUnreadCount(); renderNotifications(); }

  function handleAction(id, action) {
    if (!id) return; markAsRead(id);
    alert(`Action: ${action}\n\nIn production, this would navigate or trigger workflow.`);
  }

  function addNotification() {
    const types = ['info', 'success', 'warning', 'error'];
    const icons = ['ℹ️', '✅', '⚠️', '❌', '💬', '📅', '🎉', '📊'];
    const titles = ['New update available', 'Task completed', 'Security alert', 'File shared with you', 'Comment on your post', 'Meeting invitation', 'Milestone reached', 'System maintenance'];
    const messages = ['Check out the latest features', 'Your task has been successfully completed', 'Unusual login detected from new location', 'John Doe shared a file with you', 'Sarah commented on your design', 'Team meeting scheduled for tomorrow', 'Project reached 50% completion', 'Scheduled maintenance in 24 hours'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const newNotification = { id: Date.now().toString(), type: randomType, icon: randomIcon, title: randomTitle, message: randomMessage, time: 'Just now', unread: true, actions: [{ label: 'View', primary: true }, { label: 'Dismiss', primary: false }] };
    notifications.unshift(newNotification); updateUnreadCount(); renderNotifications();
  }

  function clearAll() { if (confirm('Clear all notifications?')) { notifications = []; updateUnreadCount(); renderNotifications(); } }

  markAllReadBtn?.addEventListener('click', markAllAsRead);
  settingsBtn?.addEventListener('click', () => alert('Notification Settings\n\nIn production, open settings modal.'));
  viewAllLink?.addEventListener('click', (e) => { e.preventDefault(); alert('View All Notifications - navigate to notifications page'); });
  tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); currentTab = tab.dataset.tab; renderNotifications(); }); });
  addNotificationBtn?.addEventListener('click', addNotification);
  clearAllBtn?.addEventListener('click', clearAll);

  themeToggle?.addEventListener('click', () => {
    const html = document.documentElement; const currentTheme = html.getAttribute('data-theme'); const newTheme = currentTheme === 'light' ? 'dark' : 'light'; html.setAttribute('data-theme', newTheme); localStorage.setItem('meaux-theme', newTheme);
  });

  const savedTheme = localStorage.getItem('meaux-theme') || document.documentElement.getAttribute('data-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  updateUnreadCount(); renderNotifications();
}
