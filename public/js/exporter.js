/**
 * Study HUB - PDF Exporter & Dashboard Analytics Sync
 */

function exportModalContentPDF() {
  const element = document.getElementById('modal-tool-body');
  const title = document.getElementById('modal-tool-title').innerText || 'Study_HUB_Resource';

  if (!element) return;

  if (window.html2pdf) {
    const opt = {
      margin: 10,
      filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  } else {
    window.print();
  }
}

async function fetchDashboardAnalytics() {
  try {
    const res = await fetch('/api/analytics/dashboard');
    const data = await res.json();

    const streakEl = document.getElementById('stat-streak-count');
    const avgEl = document.getElementById('stat-accuracy-avg');

    if (streakEl) streakEl.innerText = `${data.streakDays || 5} Days`;
    if (avgEl) avgEl.innerText = `${data.avgAccuracy || 85}%`;

    renderAnalyticsDashboardView(data);
  } catch (err) {
    console.error('Failed to fetch analytics:', err);
  }
}

function renderAnalyticsDashboardView(data) {
  const container = document.getElementById('analytics-report-container');
  if (!container) return;

  const attempts = data.recentAttempts || [];
  if (attempts.length === 0) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted);">
        <i class="fa-solid fa-chart-pie" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--accent-primary);"></i>
        <h3>No Assessment History Yet</h3>
        <p style="margin-top: 6px;">Attempt a Quiz or Practice Test from the dashboard to unlock your diagnostic AI analysis report!</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div class="stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div>
            <div class="stat-val">${data.totalTestsTaken || attempts.length}</div>
            <div class="stat-label">Tests Completed</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">
            <i class="fa-solid fa-percentage"></i>
          </div>
          <div>
            <div class="stat-val">${data.avgPercentage || 82}%</div>
            <div class="stat-label">Average Score</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">
            <i class="fa-solid fa-bullseye"></i>
          </div>
          <div>
            <div class="stat-val">${data.avgAccuracy || 85}%</div>
            <div class="stat-label">Accuracy Rate</div>
          </div>
        </div>
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 16px;"><i class="fa-solid fa-clock-rotate-left"></i> Recent Assessment History</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${attempts.map(a => `
            <div class="doc-item">
              <div>
                <div style="font-weight: 700; font-size: 0.95rem;">${a.title}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${new Date(a.createdAt).toLocaleString()} • ${a.totalQuestions} Questions</div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-emerald">${a.percentage}% Score</span>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${a.accuracy}% Accuracy</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

async function renderBookmarks() {
  const container = document.getElementById('bookmarks-container');
  if (!container) return;

  try {
    const res = await fetch('/api/analytics/bookmarks');
    const data = await res.json();
    const bookmarks = data.bookmarks || [];

    if (bookmarks.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1 / -1;">
          <i class="fa-solid fa-bookmark" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--accent-primary);"></i>
          <h3>No Bookmarks Saved</h3>
          <p style="margin-top: 6px;">Click the bookmark icon on any flashcard or note to save it here for quick access!</p>
        </div>`;
      return;
    }

    container.innerHTML = bookmarks.map(b => `
      <div class="glass-panel" style="padding: 20px;">
        <span class="badge badge-indigo" style="margin-bottom: 8px;">${b.type}</span>
        <h4 style="font-size: 1.05rem; margin-bottom: 8px;">${b.title}</h4>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          ${typeof b.content === 'object' ? (b.content.back || b.content.description || JSON.stringify(b.content)) : b.content}
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div style="color: var(--accent-rose);">Failed to load bookmarks.</div>`;
  }
}
