/**
 * Study HUB - 20 AI Toolkit Modules Controller & Views Renderer
 */

const AI_TOOLS = [
  { id: 'detailedNotes', title: 'Detailed Notes Generator', icon: 'fa-book-open', badge: 'Structured', color: '#10a37f', desc: 'Comprehensive study notes with Intro, Simple & Detailed Explanation, Examples, Pros/Cons, Memory Tricks, and Exam Tips.' },
  { id: 'shortNotes', title: 'Short Notes Generator', icon: 'fa-file-lines', badge: 'High Yield', color: '#a855f7', desc: 'Concise bullet points, key takeaways, and definitions ideal for rapid exam revision.' },
  { id: 'smartSummary', title: 'Smart Summary', icon: 'fa-compress', badge: 'Overview', color: '#06b6d4', desc: 'Executive summary with key highlights, core concept matrix, and takeaways.' },
  { id: 'mcqGenerator', title: 'MCQ Generator', icon: 'fa-list-check', badge: 'Customizable', color: '#10b981', desc: 'Generate MCQs filtered by question count, difficulty level, and source notes.' },
  { id: 'quizGenerator', title: 'Quiz Generator', icon: 'fa-clock-rotate-left', badge: 'Timed', color: '#f59e0b', desc: 'Interactive timed quizzes with negative marking, exam pattern options, and auto-scoring.' },
  { id: 'practiceTest', title: 'Practice Test', icon: 'fa-vial-circle-check', badge: 'Exam Mode', color: '#ef4444', desc: 'Full formal exam interface with countdown timer, question palette grid, mark for review, and auto-submit.' },
  { id: 'flashcards', title: 'Flashcards', icon: 'fa-layer-group', badge: '3D Flip Cards', color: '#ec4899', desc: 'Interactive flip cards for active recall memory retention with next/previous controls.' },
  { id: 'flowchartGenerator', title: 'Flowchart Generator', icon: 'fa-diagram-project', badge: 'Mermaid.js', color: '#3b82f6', desc: 'Automated process workflows and system execution flowcharts rendered via Mermaid.js.' },
  { id: 'mindmapGenerator', title: 'Mind Map Generator', icon: 'fa-sitemap', badge: 'Mermaid.js', color: '#8b5cf6', desc: 'Chapter hierarchy and concept tree mind maps rendered visually.' },
  { id: 'importantQuestions', title: 'Important Questions', icon: 'fa-star', badge: 'High Probable', color: '#f59e0b', desc: 'Top high-yield exam questions categorized by weightage marks.' },
  { id: 'vivaQuestions', title: 'Viva Questions', icon: 'fa-comments', badge: 'Oral Q&A', color: '#84cc16', desc: 'Rapid-fire viva questions with examiner tips and ideal concise oral answers.' },
  { id: 'interviewQuestions', title: 'Interview Questions', icon: 'fa-briefcase', badge: 'Technical', color: '#6366f1', desc: 'Technical & scenario interview questions with STAR method structured answers.' },
  { id: 'aiChat', title: 'GINI AI', icon: 'fa-robot', badge: 'Coming Soon', color: '#a855f7', desc: 'Personalized AI Study Assistant (Coming Soon)' },
  { id: 'analytics', title: 'Performance Analytics', icon: 'fa-chart-column', badge: 'Diagnostic', color: '#f43f5e', desc: 'Accuracy graphs, topic weakness matrix, and predicted exam readiness score.' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderToolsGrid();
});

function renderToolsGrid(filterText = '') {
  const container = document.getElementById('tools-grid-container');
  if (!container) return;

  const filtered = AI_TOOLS.filter(t => 
    t.title.toLowerCase().includes(filterText.toLowerCase()) || 
    t.desc.toLowerCase().includes(filterText.toLowerCase())
  );

  container.innerHTML = filtered.map(tool => `
    <div class="tool-card" onclick="triggerTool('${tool.id}')">
      <div>
        <div class="tool-header">
          <div class="tool-icon" style="background: ${tool.color};">
            <i class="fa-solid ${tool.icon}"></i>
          </div>
          <span class="badge badge-indigo">${tool.badge}</span>
        </div>
        <div class="tool-title">${tool.title}</div>
        <div class="tool-desc">${tool.desc}</div>
      </div>
      <div class="tool-footer">
        <span>Generate Resource</span>
        <i class="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  `).join('');
}

function filterTools(query) {
  renderToolsGrid(query);
}

function triggerTool(toolId) {
  if (toolId === 'aiChat') {
    showComingSoonModal('GINI AI');
    return;
  }
  if (toolId === 'analytics') {
    switchView('analytics');
    return;
  }

  // Tools requiring custom options prompt modal before execution
  if (toolId === 'mcqGenerator') {
    openMCQConfigModal();
    return;
  }
  if (toolId === 'quizGenerator') {
    openQuizConfigModal('quizGenerator');
    return;
  }
  if (toolId === 'practiceTest') {
    openQuizConfigModal('practiceTest');
    return;
  }

  // Direct execution tools
  executeAITool(toolId);
}

function openMCQConfigModal() {
  const title = document.getElementById('modal-tool-title');
  const body = document.getElementById('modal-tool-body');

  title.innerText = 'Configure MCQ Generator';
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <label style="font-weight: 600; font-size: 0.9rem; display: block; margin-bottom: 6px;">Number of Questions:</label>
        <select id="cfg-mcq-count" class="btn btn-secondary" style="width: 100%; text-align: left;">
          <option value="5">5 Questions</option>
          <option value="10" selected>10 Questions</option>
          <option value="15">15 Questions</option>
          <option value="20">20 Questions</option>
        </select>
      </div>
      <div>
        <label style="font-weight: 600; font-size: 0.9rem; display: block; margin-bottom: 6px;">Difficulty:</label>
        <select id="cfg-mcq-diff" class="btn btn-secondary" style="width: 100%; text-align: left;">
          <option value="Easy">Easy</option>
          <option value="Medium" selected>Medium</option>
          <option value="Hard">Hard</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>
      <div>
        <label style="font-weight: 600; font-size: 0.9rem; display: block; margin-bottom: 6px;">Question Source:</label>
        <select id="cfg-mcq-source" class="btn btn-secondary" style="width: 100%; text-align: left;">
          <option value="Notes" selected>Notes</option>
          <option value="PYQs">PYQs</option>
          <option value="Syllabus">Syllabus</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="submitMCQConfig()" style="margin-top: 12px; width: 100%;">
        <i class="fa-solid fa-wand-magic-sparkles"></i> Generate MCQs
      </button>
    </div>
  `;
  openToolModal();
}

function submitMCQConfig() {
  const options = {
    count: parseInt(document.getElementById('cfg-mcq-count').value),
    difficulty: document.getElementById('cfg-mcq-diff').value,
    source: document.getElementById('cfg-mcq-source').value
  };
  executeAITool('mcqGenerator', options);
}

function openQuizConfigModal(toolType) {
  const title = document.getElementById('modal-tool-title');
  const body = document.getElementById('modal-tool-body');

  title.innerText = toolType === 'practiceTest' ? 'Configure Practice Test Exam' : 'Configure Interactive Quiz';
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">Number of Questions:</label>
          <select id="cfg-qz-count" class="btn btn-secondary" style="width: 100%;">
            <option value="5">5 Questions</option>
            <option value="10" selected>10 Questions</option>
            <option value="15">15 Questions</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">Difficulty:</label>
          <select id="cfg-qz-diff" class="btn btn-secondary" style="width: 100%;">
            <option value="Easy">Easy</option>
            <option value="Medium" selected>Medium</option>
            <option value="Hard">Hard</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">Marks per Question:</label>
          <input type="number" id="cfg-qz-marks" class="btn btn-secondary" value="2" style="width: 100%;">
        </div>
        <div>
          <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">Negative Marking:</label>
          <input type="number" step="0.25" id="cfg-qz-neg" class="btn btn-secondary" value="0.5" style="width: 100%;">
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">Time Limit (Mins):</label>
          <input type="number" id="cfg-qz-time" class="btn btn-secondary" value="10" style="width: 100%;">
        </div>
        <div>
          <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">Exam Pattern:</label>
          <select id="cfg-qz-pattern" class="btn btn-secondary" style="width: 100%;">
            <option value="University" selected>University</option>
            <option value="Placement">Placement</option>
            <option value="Interview">Interview</option>
            <option value="Viva">Viva</option>
            <option value="GATE">GATE</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" onclick="submitQuizConfig('${toolType}')" style="margin-top: 12px; width: 100%;">
        <i class="fa-solid fa-play"></i> Start Assessment
      </button>
    </div>
  `;
  openToolModal();
}

function submitQuizConfig(toolType) {
  const options = {
    count: parseInt(document.getElementById('cfg-qz-count').value),
    difficulty: document.getElementById('cfg-qz-diff').value,
    marksPerQuestion: parseFloat(document.getElementById('cfg-qz-marks').value) || 2,
    negativeMarking: parseFloat(document.getElementById('cfg-qz-neg').value) || 0.5,
    timeLimit: parseInt(document.getElementById('cfg-qz-time').value) || 10,
    pattern: document.getElementById('cfg-qz-pattern').value
  };
  executeAITool(toolType, options);
}

async function executeAITool(toolType, options = {}) {
  openToolModal();
  const title = document.getElementById('modal-tool-title');
  const body = document.getElementById('modal-tool-body');

  const toolMeta = AI_TOOLS.find(t => t.id === toolType) || { title: 'AI Tool' };
  title.innerText = toolMeta.title;
  body.innerHTML = `
    <div style="padding: 40px; text-align: center;">
      <i class="fa-solid fa-sparkles fa-spin" style="font-size: 2.5rem; color: var(--accent-primary); margin-bottom: 16px;"></i>
      <h3>Generating AI Study Content...</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">
        Processing RAG vectors and grounding response in your study materials.
      </p>
    </div>`;

  try {
    const res = await fetch(`/api/ai/${toolType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: selectedDocumentId,
        options
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Generation failed');

    renderToolResponse(toolType, data.data);

  } catch (err) {
    console.error('Tool execution error:', err);
    body.innerHTML = `
      <div style="padding: 24px; color: var(--accent-rose);">
        <i class="fa-solid fa-triangle-exclamation"></i> Execution Error: ${err.message}
      </div>`;
  }
}

function openToolModal() {
  const modal = document.getElementById('tool-modal-overlay');
  if (modal) modal.classList.add('open');
}

function closeToolModal() {
  const modal = document.getElementById('tool-modal-overlay');
  if (modal) modal.classList.remove('open');
}

function renderToolResponse(toolType, data) {
  const body = document.getElementById('modal-tool-body');
  if (!body) return;

  if (toolType === 'detailedNotes') {
    renderDetailedNotesView(body, data);
  } else if (toolType === 'mcqGenerator') {
    renderMCQView(body, data);
  } else if (toolType === 'quizGenerator' || toolType === 'practiceTest') {
    startInteractiveQuizEngine(body, data);
  } else if (toolType === 'flashcards') {
    renderFlashcardEngine(body, data);
  } else if (toolType === 'flowchartGenerator') {
    renderFlowchartDiagram(body, data);
  } else if (toolType === 'mindmapGenerator') {
    renderMindmapDiagram(body, data);
  } else if (toolType === 'importantQuestions') {
    renderImportantQuestionsView(body, data);
  } else if (toolType === 'vivaQuestions') {
    renderVivaQuestionsView(body, data);
  } else if (toolType === 'interviewQuestions') {
    renderInterviewQuestionsView(body, data);
  } else {
    // Markdown or HTML string response tools: shortNotes, smartSummary
    body.innerHTML = `
      <div class="glass-panel" style="padding: 24px; line-height: 1.6; font-size: 0.95rem;">
        ${formatMarkdownHTML(typeof data === 'string' ? data : JSON.stringify(data, null, 2))}
      </div>`;
  }
}

function formatMarkdownHTML(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3 style="margin-top: 14px; margin-bottom: 6px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="margin-top: 18px; margin-bottom: 8px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="margin-top: 20px; margin-bottom: 10px;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
