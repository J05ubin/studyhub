/**
 * Study HUB - Main Client Application Router & Theme Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchDocumentsList();
  fetchDashboardAnalytics();
  initMermaid();
});

// Light / Dark Theme Switcher
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('study_hub_theme', theme);

  const darkBtn = document.getElementById('btn-theme-dark');
  const lightBtn = document.getElementById('btn-theme-light');

  if (theme === 'light') {
    darkBtn.classList.remove('active');
    lightBtn.classList.add('active');
  } else {
    lightBtn.classList.remove('active');
    darkBtn.classList.add('active');
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('study_hub_theme') || 'dark';
  setTheme(savedTheme);
}

// View Navigation
function switchView(viewName) {
  if (viewName === 'toolkit') {
    const dashboardView = document.getElementById('view-dashboard');
    const views = ['analytics', 'bookmarks'];
    if (dashboardView) dashboardView.style.display = 'block';
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.style.display = 'none';
    });

    const toolkitEl = document.getElementById('tools-grid-container') || document.querySelector('.section-header');
    if (toolkitEl) toolkitEl.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const views = ['dashboard', 'analytics', 'bookmarks'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = (v === viewName) ? 'block' : 'none';
  });

  const navItems = document.querySelectorAll('.app-sidebar .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  if (viewName === 'dashboard') {
    if (navItems[0]) navItems[0].classList.add('active');
  } else if (viewName === 'analytics') {
    if (navItems[1]) navItems[1].classList.add('active');
    fetchDashboardAnalytics();
  } else if (viewName === 'bookmarks') {
    if (navItems[2]) navItems[2].classList.add('active');
    renderBookmarks();
  }
}

function scrollToUploader() {
  switchView('dashboard');
  const el = document.getElementById('uploader-anchor');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function initMermaid() {
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'default' : 'dark',
      securityLevel: 'loose'
    });
  }
}
