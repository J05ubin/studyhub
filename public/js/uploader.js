/**
 * Study HUB - Document Uploader & Material Library Manager
 */

let uploadedDocuments = [];
let selectedDocumentId = 'all';

// Initialize Drag & Drop Events
document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone-box');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      uploadFileToServer(files[0]);
    }
  });
});

function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    uploadFileToServer(files[0]);
  }
}

async function uploadFileToServer(file) {
  const statusEl = document.getElementById('upload-status-text');
  const fileType = document.getElementById('upload-doc-type').value;

  updateWorkflowStatus('process');
  if (statusEl) statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing & extracting text from ${file.name}...`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);

  try {
    updateWorkflowStatus('chunks');
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');

    updateWorkflowStatus('embed');
    setTimeout(() => updateWorkflowStatus('vector'), 400);
    setTimeout(() => updateWorkflowStatus('dashboard'), 800);

    if (statusEl) {
      statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i> ${data.document.title} indexed! (${data.document.chunkCount} vector chunks created)`;
    }

    fetchDocumentsList();

  } catch (err) {
    console.error('Upload error:', err);
    if (statusEl) {
      statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-rose);"></i> Error: ${err.message}`;
    }
  }
}

async function fetchDocumentsList() {
  try {
    const res = await fetch('/api/documents');
    const data = await res.json();
    uploadedDocuments = data.documents || [];

    renderDocumentLibrary();
    updateSidebarDocSelect();
    updateStatsCounters();
  } catch (err) {
    console.error('Failed to fetch documents:', err);
  }
}

function renderDocumentLibrary() {
  const container = document.getElementById('doc-library-container');
  const badge = document.getElementById('doc-badge-count');

  if (badge) badge.innerText = `${uploadedDocuments.length} Docs`;

  if (!container) return;

  if (uploadedDocuments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">
        No study materials uploaded yet. Upload a document to start generating resources!
      </div>`;
    return;
  }

  container.innerHTML = uploadedDocuments.map(doc => `
    <div class="doc-item">
      <div class="doc-info">
        <i class="fa-solid ${getFileIcon(doc.fileType)}" style="color: var(--accent-primary); font-size: 1.1rem;"></i>
        <div>
          <div class="doc-title" title="${doc.originalName}">${doc.title || doc.originalName}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${doc.fileType} • ${doc.wordCount || 0} words</div>
        </div>
      </div>
      <button class="btn btn-secondary btn-icon" onclick="deleteDocumentItem('${doc._id}')" title="Delete Document">
        <i class="fa-solid fa-trash-can" style="color: var(--accent-rose); font-size: 0.85rem;"></i>
      </button>
    </div>
  `).join('');
}

function updateSidebarDocSelect() {
  const select = document.getElementById('sidebar-doc-select');
  if (!select) return;

  let optionsHtml = `<option value="all">📚 All Uploaded Docs (RAG)</option>`;
  uploadedDocuments.forEach(doc => {
    optionsHtml += `<option value="${doc._id}">📄 ${doc.title || doc.originalName}</option>`;
  });
  select.innerHTML = optionsHtml;
  select.value = selectedDocumentId;
}

function handleDocSelectionChange(val) {
  selectedDocumentId = val;
}

async function deleteDocumentItem(id) {
  if (!confirm('Are you sure you want to delete this document?')) return;
  try {
    await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    fetchDocumentsList();
  } catch (err) {
    alert('Failed to delete document: ' + err.message);
  }
}

function getFileIcon(type) {
  if (type === 'PDF Notes') return 'fa-file-pdf';
  if (type === 'DOCX Notes') return 'fa-file-word';
  if (type === 'Previous Year Question Papers (PYQs)') return 'fa-file-circle-question';
  if (type === 'Syllabus Documents') return 'fa-file-lines';
  return 'fa-file-lines';
}

function updateStatsCounters() {
  const docCountEl = document.getElementById('stat-docs-count');
  const chunkCountEl = document.getElementById('stat-chunks-count');

  if (docCountEl) docCountEl.innerText = uploadedDocuments.length;
  
  let totalChunks = 0;
  uploadedDocuments.forEach(d => {
    totalChunks += Math.ceil((d.wordCount || 0) / 300);
  });
  if (chunkCountEl) chunkCountEl.innerText = totalChunks || (uploadedDocuments.length * 4);
}

function updateWorkflowStatus(activeStepKey) {
  const steps = ['upload', 'process', 'extract', 'chunks', 'embed', 'vector', 'dashboard'];
  let found = false;
  steps.forEach(step => {
    const el = document.getElementById(`wf-step-${step}`);
    if (el) {
      if (step === activeStepKey) {
        el.className = 'wf-step active';
        found = true;
      } else if (!found) {
        el.className = 'wf-step completed';
      } else {
        el.className = 'wf-step';
      }
    }
  });
}
