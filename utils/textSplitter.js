/**
 * Split text into semantic chunks with overlap for RAG embeddings
 * @param {string} text 
 * @param {number} chunkSize Words per chunk (default ~350)
 * @param {number} chunkOverlap Overlap words (default ~50)
 * @returns {Array<{ chunkIndex: number, text: string }>}
 */
function splitTextIntoChunks(text, chunkSize = 350, chunkOverlap = 50) {
  if (!text || typeof text !== 'string') return [];
  
  const cleanedText = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
  const words = cleanedText.split(/\s+/);
  
  if (words.length <= chunkSize) {
    return [{ chunkIndex: 0, text: cleanedText }];
  }

  const chunks = [];
  let index = 0;
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunkText = words.slice(start, end).join(' ');
    
    chunks.push({
      chunkIndex: index++,
      text: chunkText
    });

    start += (chunkSize - chunkOverlap);
  }

  return chunks;
}

module.exports = { splitTextIntoChunks };
