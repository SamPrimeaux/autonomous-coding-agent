// Login & Onboarding Portal - Industry Standard
export default function Login() {
  return `
    <div class="login-container" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg0); position: relative; overflow: hidden;">
      <div class="fx-stars"></div>
      <div class="fx-nebula"></div>
      
      <div class="login-card" style="width: 100%; max-width: 440px; padding: 48px; background: var(--glass2); backdrop-filter: blur(60px); border: 1px solid var(--stroke); border-radius: 32px; box-shadow: var(--shadow); position: relative; z-index: 10; animation: fadeIn 0.6s ease;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="width: 72px; height: 72px; background: linear-gradient(135deg, var(--cyan), var(--blue)); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 8px 32px var(--cyan-glow);">
            <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
          </div>
          <h1 id="portal-title" style="font-size: 28px; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.03em;">Welcome Back</h1>
          <p id="portal-desc" style="font-size: 15px; color: var(--muted); margin-top: 10px;">Access your industrial edge cluster</p>
        </div>

        <div id="login-mode-container">
          <form id="loginForm" style="display: flex; flex-direction: column; gap: 24px;">
            <div class="input-group">
              <label style="display: block; font-size: 11px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Email Identity</label>
              <input type="email" id="email" required placeholder="ceo@company.com" style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--stroke); border-radius: 14px; color: #fff; font-size: 15px; transition: var(--transition); outline: none;">
            </div>
            
            <div class="input-group">
              <label style="display: block; font-size: 11px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Security Key</label>
              <input type="password" id="password" required placeholder="••••••••••••" style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--stroke); border-radius: 14px; color: #fff; font-size: 15px; transition: var(--transition); outline: none;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 16px; font-weight: 800; margin-top: 8px;">
              Enter Cluster
            </button>
          </form>

          <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="flex: 1; height: 1px; background: var(--stroke);"></div>
              <span style="font-size: 12px; color: var(--muted2); font-weight: 700;">OR</span>
              <div style="flex: 1; height: 1px; background: var(--stroke);"></div>
            </div>

            <button id="googleLoginBtn" class="btn btn-secondary" style="width: 100%; padding: 16px; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px; border-color: var(--stroke);">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.01h2.64c1.55-1.42 2.43-3.52 2.43-5.94z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.01c-.73.48-1.66.76-2.64.76-2.85 0-5.27-1.92-6.13-4.51H2.18v2.09C3.99 20.24 7.75 23 12 23z"/>
                <path fill="#FBBC05" d="M5.87 14.58c-.22-.66-.35-1.36-.35-2.08s.13-1.42.35-2.08V8.33H2.18C1.43 9.83 1 11.5 1 12.5s.43 2.67 1.18 4.17l3.69-2.09z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.75 1 3.99 3.76 2.18 7.42l3.69 2.09c.86-2.59 3.28-4.51 6.13-4.51z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div style="margin-top: 32px; text-align: center;">
            <p style="font-size: 14px; color: var(--muted);">
              New to Meauxbility? <a href="#" id="toggle-auth" style="color: var(--cyan); font-weight: 700; text-decoration: none;">Create an account</a>
            </p>
          </div>
        </div>

        <!-- Success Message (Hidden) -->
        <div id="auth-success" style="display: none; text-align: center; padding: 20px 0;">
          <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; animation: pulse 2s infinite;">
            <svg width="32" height="32" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 style="color: #fff; font-size: 20px; font-weight: 800;">Identity Verified</h2>
          <p style="color: var(--muted); font-size: 14px; margin-top: 8px;">Redirecting to global dashboard...</p>
        </div>

        <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--stroke); text-align: center;">
          <p style="font-size: 12px; color: var(--muted2); line-height: 1.6;">
            Protected by MeauxSecurity Biometrics & RSA-4096.<br>
            © 2025 Inner Animal Media. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('loginForm');
  const googleBtn = document.getElementById('googleLoginBtn');
  const toggleAuth = document.getElementById('toggle-auth');
  const portalTitle = document.getElementById('portal-title');
  const portalDesc = document.getElementById('portal-desc');
  const loginModeContainer = document.getElementById('login-mode-container');
  const authSuccess = document.getElementById('auth-success');
  let isLogin = true;

  // Check for Google OAuth success redirect
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth_success') === 'true') {
    loginModeContainer.style.display = 'none';
    authSuccess.style.display = 'block';
    const email = params.get('email');
    if (email) {
      authSuccess.querySelector('p').textContent = `Authenticated as ${email}. Redirecting...`;
    }

    setTimeout(() => {
      localStorage.setItem('meaux_auth', 'true');
      window.router.navigate('/dashboard');
    }, 1500);
  }

  googleBtn?.addEventListener('click', () => {
    window.location.href = '/api/auth/google';
  });

  toggleAuth?.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    portalTitle.textContent = isLogin ? 'Welcome Back' : 'Create Account';
    portalDesc.textContent = isLogin ? 'Access your industrial edge cluster' : 'Join the world\'s most powerful edge network';
    toggleAuth.textContent = isLogin ? 'Create an account' : 'Sign in to existing account';
    form.querySelector('button').textContent = isLogin ? 'Enter Cluster' : 'Initialize Account';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = isLogin ? 'Verifying Identity...' : 'Initializing Node...';
    btn.disabled = true;

    // Simulate auth success
    setTimeout(() => {
      loginModeContainer.style.display = 'none';
      authSuccess.style.display = 'block';

      setTimeout(() => {
        localStorage.setItem('meaux_auth', 'true');
        window.router.navigate('/dashboard');
      }, 1500);
    }, 1200);
  });
}

