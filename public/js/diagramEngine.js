/**
 * Study HUB - Mermaid.js Flowchart & Mind Map Visual Engine
 */

async function renderFlowchartDiagram(container, data) {
  const mermaidCode = data.mermaidCode || `graph TD\n  A[Notes Uploaded] --> B[RAG Search]\n  B --> C[Generate Flowchart]`;
  renderMermaidContainer(container, data.title || 'Flowchart Diagram', data.description || '', mermaidCode);
}

async function renderMindmapDiagram(container, data) {
  const mermaidCode = data.mermaidCode || `mindmap\n  root((Chapter Overview))\n    Topic 1\n    Topic 2`;
  renderMermaidContainer(container, data.title || 'Mind Map', 'Visual Chapter Hierarchy Mind Map', mermaidCode);
}

function renderMermaidContainer(container, titleText, descText, mermaidCode) {
  const uniqueId = 'mermaid-' + Date.now();

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--accent-primary);">${titleText}</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted);">${descText}</p>
      </div>

      <div class="diagram-render-box" id="diagram-box">
        <div class="mermaid" id="${uniqueId}">${escapeMermaidHTML(mermaidCode)}</div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-secondary" onclick="copyMermaidCode('${encodeURIComponent(mermaidCode)}')">
          <i class="fa-solid fa-copy"></i> Copy Code
        </button>
      </div>
    </div>`;

  setTimeout(() => {
    try {
      if (window.mermaid) {
        window.mermaid.run({
          nodes: [document.getElementById(uniqueId)]
        });
      }
    } catch (err) {
      console.warn('Mermaid rendering warning:', err);
    }
  }, 100);
}

function escapeMermaidHTML(code) {
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function copyMermaidCode(encodedCode) {
  const code = decodeURIComponent(encodedCode);
  navigator.clipboard.writeText(code);
  alert('Mermaid syntax copied to clipboard!');
}
