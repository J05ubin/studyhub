/**
 * Study HUB - Authentication Engine & JWT Client Manager
 */

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  initAuthSession();
});

function getAuthToken() {
  return localStorage.getItem('study_hub_token') || '';
}

function setAuthSession(token, user) {
  localStorage.setItem('study_hub_token', token);
  localStorage.setItem('study_hub_user', JSON.stringify(user));
  currentUser = user;
  updateAuthUI();
}

function clearAuthSession() {
  localStorage.removeItem('study_hub_token');
  localStorage.removeItem('study_hub_user');
  currentUser = null;
  updateAuthUI();
}

async function initAuthSession() {
  const token = getAuthToken();
  const savedUser = localStorage.getItem('study_hub_user');

  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      currentUser = null;
    }
  }

  if (token) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        localStorage.setItem('study_hub_user', JSON.stringify(currentUser));
      } else {
        clearAuthSession();
      }
    } catch (err) {
      // If server check fails, keep local user session if present
    }
  }

  updateAuthUI();
}

function updateAuthUI() {
  const authBtnContainer = document.getElementById('navbar-auth-container');
  if (!authBtnContainer) return;

  if (currentUser) {
    authBtnContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="user-avatar-badge" title="${currentUser.email}">
          <i class="fa-solid fa-user-circle" style="font-size: 1.2rem; color: var(--accent-primary);"></i>
          <span style="font-weight: 700; font-size: 0.9rem;">${currentUser.name || 'Student'}</span>
        </div>
        <button class="btn btn-secondary btn-icon" onclick="handleLogout()" title="Logout">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>`;
  } else {
    authBtnContainer.innerHTML = `
      <button class="btn btn-secondary" onclick="openAuthModal('login')">
        <i class="fa-solid fa-right-to-bracket"></i> Sign In
      </button>`;
  }
}

function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal-overlay');
  if (modal) {
    switchAuthTab(tab);
    modal.classList.add('open');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal-overlay');
  if (modal) modal.classList.remove('open');
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');
  const errorEl = document.getElementById('auth-error-msg');

  if (errorEl) errorEl.style.display = 'none';

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'flex';
    if (registerForm) registerForm.style.display = 'none';
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'flex';
  }
}

async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorEl = document.getElementById('auth-error-msg');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!email || !password) {
    showAuthError('Please enter both email and password.');
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Login failed');

    setAuthSession(data.token, data.user);
    closeAuthModal();
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
  } catch (err) {
    showAuthError(err.message);
  }
}

async function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!name || !email || !password) {
    showAuthError('All fields are required.');
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setAuthSession(data.token, data.user);
    closeAuthModal();
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
  } catch (err) {
    showAuthError(err.message);
  }
}

function showAuthError(msg) {
  const errorEl = document.getElementById('auth-error-msg');
  if (errorEl) {
    errorEl.innerText = msg;
    errorEl.style.display = 'block';
  }
}

function handleLogout() {
  clearAuthSession();
}

function getAuthHeader() {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
