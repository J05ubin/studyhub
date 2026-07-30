/**
 * Study HUB - 3D Flip Flashcard Interactive Engine
 */

let flashcardList = [];
let activeCardIndex = 0;

function renderFlashcardEngine(container, data) {
  flashcardList = data.flashcards || [];
  activeCardIndex = 0;

  if (flashcardList.length === 0) {
    container.innerHTML = '<div>No flashcards generated.</div>';
    return;
  }

  renderActiveCard(container);
}

function renderActiveCard(container) {
  const card = flashcardList[activeCardIndex];
  const total = flashcardList.length;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 24px;">
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 600px;">
        <span class="badge badge-indigo">Card ${activeCardIndex + 1} of ${total}</span>
        <span class="badge badge-amber">${card.topic || 'Flashcard'}</span>
        <button class="btn btn-secondary btn-icon" onclick="saveFlashcardBookmark()" title="Bookmark Card">
          <i class="fa-solid fa-bookmark" style="color: var(--accent-primary);"></i>
        </button>
      </div>

      <!-- 3D Flip Flashcard Container -->
      <div class="flashcard-wrapper" onclick="toggleCardFlip(this)">
        <div class="flashcard-inner" id="active-card-inner">
          <div class="flashcard-front">
            <i class="fa-solid fa-lightbulb" style="font-size: 2rem; color: var(--accent-amber); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.25rem; font-weight: 700; line-height: 1.4;">${card.front}</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 20px;">
              <i class="fa-solid fa-hand-pointer"></i> Click card to flip answer
            </p>
          </div>

          <div class="flashcard-back">
            <i class="fa-solid fa-graduation-cap" style="font-size: 2rem; color: var(--accent-emerald); margin-bottom: 16px;"></i>
            <p style="font-size: 1.05rem; font-weight: 600; line-height: 1.5; color: var(--text-primary);">${card.back}</p>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 16px; align-items: center;">
        <button class="btn btn-secondary" onclick="navigateFlashcard(-1)" ${activeCardIndex === 0 ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-left"></i> Previous
        </button>
        <button class="btn btn-primary" onclick="navigateFlashcard(1)" ${activeCardIndex === total - 1 ? 'disabled' : ''}>
          Next <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>`;
}

function toggleCardFlip(wrapperEl) {
  const inner = wrapperEl.querySelector('.flashcard-inner');
  if (inner) inner.classList.toggle('flipped');
}

function navigateFlashcard(delta) {
  activeCardIndex += delta;
  renderActiveCard(document.getElementById('modal-tool-body'));
}

async function saveFlashcardBookmark() {
  const card = flashcardList[activeCardIndex];
  if (!card) return;

  try {
    const res = await fetch('/api/analytics/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: card.front,
        type: 'flashcard',
        content: card,
        documentId: selectedDocumentId
      })
    });
    const data = await res.json();
    alert('Flashcard saved to bookmarks!');
  } catch (err) {
    alert('Failed to bookmark: ' + err.message);
  }
}
