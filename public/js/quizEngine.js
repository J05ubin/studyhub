/**
 * Study HUB - Interactive Quiz & Practice Test Engine
 */

let currentQuizData = null;
let currentQuestionIndex = 0;
let userQuizAnswers = {};
let flaggedQuestions = new Set();
let quizTimerInterval = null;
let remainingTimeSeconds = 0;

function startInteractiveQuizEngine(container, data) {
  currentQuizData = data;
  currentQuestionIndex = 0;
  userQuizAnswers = {};
  flaggedQuestions.clear();

  const timeLimitMins = data.timeLimitMinutes || 10;
  remainingTimeSeconds = timeLimitMins * 60;

  renderExamLayout(container);
  startQuizTimer();
}

function renderExamLayout(container) {
  const q = (currentQuizData.questions || [])[currentQuestionIndex];
  if (!q) {
    container.innerHTML = '<div>No questions generated.</div>';
    return;
  }

  const total = currentQuizData.questions.length;

  container.innerHTML = `
    <div class="exam-container">
      <div class="exam-header">
        <div>
          <h3 style="font-size: 1.1rem; font-weight: 700;">${currentQuizData.quizTitle || 'Practice Assessment'}</h3>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Pattern: ${currentQuizData.pattern || 'University'} • Marks/Q: ${currentQuizData.marksPerQuestion || 2} • Negative: -${currentQuizData.negativeMarking || 0.5}
          </div>
        </div>
        <div class="timer-box" id="quiz-timer-display">
          <i class="fa-solid fa-clock"></i> ${formatTimeDisplay(remainingTimeSeconds)}
        </div>
      </div>

      <div class="exam-body">
        <div>
          <div class="question-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span class="badge badge-indigo">Question ${currentQuestionIndex + 1} of ${total}</span>
              <button class="btn btn-secondary" onclick="toggleFlagForReview()" style="font-size: 0.8rem;">
                <i class="fa-solid fa-flag" style="color: ${flaggedQuestions.has(currentQuestionIndex) ? 'var(--accent-amber)' : 'var(--text-muted)'};"></i> Review Later
              </button>
            </div>
            
            <div class="question-text">${q.question}</div>

            <div class="options-list">
              ${(q.options || []).map((opt, idx) => `
                <button class="option-btn ${userQuizAnswers[currentQuestionIndex] === idx ? 'selected' : ''}" onclick="selectQuizOption(${idx})">
                  <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="navigateQuizQuestion(-1)" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-chevron-left"></i> Previous
            </button>
            
            ${currentQuestionIndex === total - 1 ? `
              <button class="btn btn-primary" onclick="confirmSubmitQuiz()">
                <i class="fa-solid fa-paper-plane"></i> Submit Exam
              </button>
            ` : `
              <button class="btn btn-primary" onclick="navigateQuizQuestion(1)">
                Next <i class="fa-solid fa-chevron-right"></i>
              </button>
            `}
          </div>
        </div>

        <!-- Question Palette -->
        <div class="glass-panel palette-card">
          <h4 style="font-size: 0.95rem; margin-bottom: 12px;">Question Palette</h4>
          <div class="palette-grid">
            ${currentQuizData.questions.map((_, i) => {
              let cls = 'palette-num';
              if (i === currentQuestionIndex) cls += ' current';
              if (userQuizAnswers[i] !== undefined) cls += ' answered';
              else if (flaggedQuestions.has(i)) cls += ' review';
              return `<div class="${cls}" onclick="jumpToQuestion(${i})">${i + 1}</div>`;
            }).join('')}
          </div>
          <div style="margin-top: 20px; font-size: 0.75rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px;">
            <div><span style="display:inline-block; width:10px; height:10px; background:var(--accent-emerald); border-radius:2px;"></span> Answered</div>
            <div><span style="display:inline-block; width:10px; height:10px; background:var(--accent-amber); border-radius:2px;"></span> Marked for Review</div>
            <div><span style="display:inline-block; width:10px; height:10px; border:2px solid var(--accent-primary); border-radius:2px;"></span> Current Question</div>
          </div>
        </div>
      </div>
    </div>`;
}

function selectQuizOption(optionIdx) {
  userQuizAnswers[currentQuestionIndex] = optionIdx;
  renderExamLayout(document.getElementById('modal-tool-body'));
}

function toggleFlagForReview() {
  if (flaggedQuestions.has(currentQuestionIndex)) {
    flaggedQuestions.delete(currentQuestionIndex);
  } else {
    flaggedQuestions.add(currentQuestionIndex);
  }
  renderExamLayout(document.getElementById('modal-tool-body'));
}

function navigateQuizQuestion(delta) {
  currentQuestionIndex += delta;
  renderExamLayout(document.getElementById('modal-tool-body'));
}

function jumpToQuestion(idx) {
  currentQuestionIndex = idx;
  renderExamLayout(document.getElementById('modal-tool-body'));
}

function startQuizTimer() {
  clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    remainingTimeSeconds--;
    const displayEl = document.getElementById('quiz-timer-display');
    if (displayEl) {
      displayEl.innerHTML = `<i class="fa-solid fa-clock"></i> ${formatTimeDisplay(remainingTimeSeconds)}`;
    }

    if (remainingTimeSeconds <= 0) {
      clearInterval(quizTimerInterval);
      alert('⏰ Time expired! Auto-submitting your exam...');
      submitQuizFinal();
    }
  }, 1000);
}

function confirmSubmitQuiz() {
  if (confirm('Are you sure you want to submit your exam?')) {
    submitQuizFinal();
  }
}

async function submitQuizFinal() {
  clearInterval(quizTimerInterval);

  const payload = {
    title: currentQuizData.quizTitle || 'Practice Test Assessment',
    documentId: selectedDocumentId,
    totalQuestions: currentQuizData.questions.length,
    userAnswers: userQuizAnswers,
    questions: currentQuizData.questions,
    timeTakenSeconds: (currentQuizData.timeLimitMinutes * 60) - remainingTimeSeconds,
    marksPerQuestion: currentQuizData.marksPerQuestion || 2,
    negativeMarking: currentQuizData.negativeMarking || 0.5
  };

  try {
    const res = await fetch('/api/analytics/quiz-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');

    renderResultAnalysisReport(data.report);

  } catch (err) {
    alert('Quiz submit error: ' + err.message);
  }
}

function renderResultAnalysisReport(report) {
  const container = document.getElementById('modal-tool-body');
  document.getElementById('modal-tool-title').innerText = '📊 AI Diagnostic Performance Report';

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div style="text-align: center; padding: 24px;" class="glass-panel">
        <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--accent-primary);">${report.score} / ${report.maxPossibleScore} Marks</h2>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald); margin-top: 4px;">Score: ${report.percentage}% (${report.accuracy}% Accuracy)</div>
        <div style="margin-top: 12px; display: flex; justify-content: center; gap: 16px; font-size: 0.88rem;">
          <span class="badge badge-emerald"><i class="fa-solid fa-check"></i> ${report.correct} Correct</span>
          <span class="badge badge-rose"><i class="fa-solid fa-xmark"></i> ${report.wrong} Wrong</span>
          <span class="badge badge-amber"><i class="fa-solid fa-forward"></i> ${report.skipped} Skipped</span>
        </div>
      </div>

      <div class="report-grid">
        <div class="glass-panel" style="padding: 20px;">
          <h4 style="color: var(--accent-cyan); margin-bottom: 8px;"><i class="fa-solid fa-gauge-high"></i> Predicted Exam Readiness</h4>
          <div style="font-size: 2rem; font-weight: 800;">${report.predictedExamReadiness}%</div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Calculated via AI RAG accuracy modeling.</p>
        </div>

        <div class="glass-panel" style="padding: 20px;">
          <h4 style="color: var(--accent-secondary); margin-bottom: 8px;"><i class="fa-solid fa-shield-halved"></i> Confidence Score</h4>
          <div style="font-size: 2rem; font-weight: 800;">${report.confidenceScore}%</div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">High consistency across core concepts.</p>
        </div>
      </div>

      <div class="glass-panel" style="padding: 20px;">
        <h4 style="margin-bottom: 14px;"><i class="fa-solid fa-list-ol"></i> Topic-Wise Breakdown</h4>
        ${(report.topicPerformance || []).map(t => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 600;">
              <span>${t.topic}</span>
              <span>${t.correct}/${t.total} (${t.percentage}%)</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${t.percentage}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="glass-panel" style="padding: 18px;">
          <h4 style="color: var(--accent-emerald); margin-bottom: 6px;"><i class="fa-solid fa-thumbs-up"></i> Strong Concepts</h4>
          <ul style="padding-left: 18px; font-size: 0.88rem; line-height: 1.5;">
            ${(report.strongAreas || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="glass-panel" style="padding: 18px;">
          <h4 style="color: var(--accent-rose); margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Focus Weak Areas</h4>
          <ul style="padding-left: 18px; font-size: 0.88rem; line-height: 1.5;">
            ${(report.weakAreas || []).map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="text-align: center; margin-top: 12px;">
        <button class="btn btn-primary" onclick="switchView('analytics'); closeToolModal();">
          <i class="fa-solid fa-chart-line"></i> View Full Analytics Dashboard
        </button>
      </div>
    </div>`;
}

function formatTimeDisplay(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
