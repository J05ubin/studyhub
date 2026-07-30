const { getGenerativeModel } = require('../config/gemini');
const { searchRelevantChunks } = require('./embeddingService');

/**
 * Generate AI content using RAG (Retrieval-Augmented Generation)
 * @param {string} promptFn 
 * @param {Array<Object>} documents 
 * @param {string} query 
 * @param {Object} options 
 * @returns {Promise<string>}
 */
async function generateRAGContent(promptFn, documents, query = '', options = {}) {
  // 1. Build Context from Documents
  let contextText = '';
  
  if (documents && documents.length > 0) {
    if (query) {
      // Vector search for query-relevant chunks
      const topChunks = await searchRelevantChunks(query, documents, options.topK || 6);
      contextText = topChunks.map(c => `[Source: ${c.documentTitle}]\n${c.chunkText}`).join('\n\n---\n\n');
    } else {
      // Gather text across documents up to ~6,000 words limit
      const chunksList = [];
      let totalLength = 0;
      for (const doc of documents) {
        const title = doc.title || doc.originalName || 'Study Material';
        const docText = doc.extractedText || (doc.chunks ? doc.chunks.map(c => c.text).join('\n') : '');
        if (docText) {
          chunksList.push(`[Document: ${title} (${doc.fileType || 'General'})]\n${docText.slice(0, 8000)}`);
          totalLength += docText.length;
          if (totalLength >= 24000) break;
        }
      }
      contextText = chunksList.join('\n\n=========================================\n\n');
    }
  }

  if (!contextText.trim()) {
    contextText = 'No specific document context provided. Generate standard comprehensive academic material on the topic.';
  }

  // 2. Prepare Prompt
  const finalPrompt = typeof promptFn === 'function' ? promptFn(contextText, options) : `${promptFn}\n\nDocument Context:\n${contextText}`;

  // 3. Call Gemini Model
  const model = getGenerativeModel('gemini-1.5-flash');

  if (!model) {
    throw new Error('GEMINI_API_KEY_REQUIRED');
  }

  try {
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(`[RAGService] Gemini API call error:`, error.message);
    if (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403')) {
      throw new Error('GEMINI_API_KEY_INVALID');
    }
    throw new Error(`AI Generation Error: ${error.message}`);
  }
}

/**
 * Clean JSON output from AI response string (removes markdown backticks ```json ... ```)
 * @param {string} rawText 
 * @returns {Object}
 */
function parseCleanJSON(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt fallback json extract
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        console.error('Failed to parse extracted JSON substring:', innerErr.message);
      }
    }
    throw new Error('Invalid JSON returned by AI model');
  }
}

module.exports = {
  generateRAGContent,
  parseCleanJSON
};
