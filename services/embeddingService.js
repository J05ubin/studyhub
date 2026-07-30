const { getEmbeddingModel } = require('../config/gemini');

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Fallback deterministic lightweight embedding generator when API key is missing
 */
function generateFallbackEmbedding(text) {
  const dim = 128;
  const vector = new Array(dim).fill(0);
  const clean = text.toLowerCase();
  for (let i = 0; i < clean.length; i++) {
    const charCode = clean.charCodeAt(i);
    const index = (charCode * (i + 1)) % dim;
    vector[index] += 1;
  }
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map(val => val / magnitude);
}

/**
 * Generate embedding using Gemini text-embedding-004
 * @param {string} text 
 * @returns {Promise<Array<number>>}
 */
async function generateEmbedding(text) {
  try {
    const model = getEmbeddingModel();
    if (!model) {
      return generateFallbackEmbedding(text);
    }
    const result = await model.embedContent(text);
    if (result && result.embedding && result.embedding.values) {
      return result.embedding.values;
    }
    return generateFallbackEmbedding(text);
  } catch (error) {
    console.warn(`[EmbeddingService] Gemini API embedding warning: ${error.message}. Using fallback vector.`);
    return generateFallbackEmbedding(text);
  }
}

/**
 * Search top-K relevant chunks across documents using vector similarity
 * @param {string} query 
 * @param {Array<Object>} documents 
 * @param {number} topK 
 * @returns {Promise<Array<{ chunkText: string, documentTitle: string, documentId: string, score: number }>>}
 */
async function searchRelevantChunks(query, documents, topK = 5) {
  if (!documents || documents.length === 0) return [];
  
  const queryVector = await generateEmbedding(query);
  const matches = [];

  for (const doc of documents) {
    if (!doc.chunks || doc.chunks.length === 0) continue;
    for (const chunk of doc.chunks) {
      let score = 0;
      if (chunk.embedding && chunk.embedding.length > 0) {
        score = cosineSimilarity(queryVector, chunk.embedding);
      } else {
        // Fallback keyword relevance score if embeddings not computed
        const qTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
        const chunkLower = chunk.text.toLowerCase();
        let termMatches = 0;
        qTerms.forEach(t => { if (chunkLower.includes(t)) termMatches++; });
        score = qTerms.length ? termMatches / qTerms.length : 0.1;
      }

      matches.push({
        chunkText: chunk.text,
        documentTitle: doc.title || doc.originalName || 'Uploaded Document',
        documentId: doc._id ? doc._id.toString() : doc.id,
        score
      });
    }
  }

  // Sort descending by similarity score
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, topK);
}

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  searchRelevantChunks
};
