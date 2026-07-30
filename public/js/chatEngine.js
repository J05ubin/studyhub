/**
 * Study HUB - GINI AI Assistant (Coming Soon Handler)
 */

function showComingSoonModal(featureName = 'GINI AI') {
  const title = document.getElementById('modal-tool-title');
  const body = document.getElementById('modal-tool-body');

  if (title) title.innerText = featureName;
  if (body) {
    body.innerHTML = `
      <div style="padding: 40px 24px; text-align: center;">
        <div style="width: 72px; height: 72px; border-radius: var(--radius-full); background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 20px;">
          <i class="fa-solid fa-clock-rotate-left fa-spin-pulse"></i>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px;">Coming Soon!</h2>
        <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 420px; margin: 0 auto 24px auto; line-height: 1.6;">
          <strong>${featureName}</strong> is currently under active development. Stay tuned for multi-turn document conversational AI!
        </p>
        <button class="btn btn-primary" onclick="closeToolModal()">Got It</button>
      </div>`;
  }
  openToolModal();
}

function toggleChatDrawer() {
  showComingSoonModal('GINI AI');
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages-container');

  const text = input.value ? input.value.trim() : '';
  if (!text) return;

  // Add User Message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = text;
  messagesContainer.appendChild(userBubble);

  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Add Loading indicator
  const loadingBubble = document.createElement('div');
  loadingBubble.className = 'chat-bubble ai';
  loadingBubble.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Searching vector chunks and generating grounded response...`;
  messagesContainer.appendChild(loadingBubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        documentId: selectedDocumentId
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Chat request failed');

    loadingBubble.remove();

    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    
    let citationsHtml = '';
    if (data.citations && data.citations.length > 0) {
      citationsHtml = `
        <div style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 8px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">Document Citations:</div>
          ${data.citations.map(c => `
            <div class="citation-chip" title="${c.snippet}">
              <i class="fa-solid fa-file-lines"></i> ${c.documentTitle} (${c.score})
            </div>
          `).join(' ')}
        </div>`;
    }

    aiBubble.innerHTML = `${formatMarkdownHTML(data.answer)}${citationsHtml}`;
    messagesContainer.appendChild(aiBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  } catch (err) {
    loadingBubble.className = 'chat-bubble ai';
    loadingBubble.innerHTML = `<span style="color: var(--accent-rose);">Error: ${err.message}</span>`;
  }
}
