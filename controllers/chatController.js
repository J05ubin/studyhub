const { getDocumentsForRAG } = require('./documentController');
const { searchRelevantChunks } = require('../services/embeddingService');
const { getGenerativeModel } = require('../config/gemini');

/**
 * RAG AI Chat handler with document citations
 */
async function handleChat(req, res) {
  try {
    const { message, documentId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'User message is required.' });
    }

    const documents = await getDocumentsForRAG(documentId);

    if (!documents || documents.length === 0) {
      return res.json({
        answer: "I don't have any uploaded study materials yet! Please upload a PDF, DOCX, or text file on the left panel so I can answer your questions directly from your notes.",
        citations: []
      });
    }

    // Perform vector semantic search for relevant chunks
    const relevantChunks = await searchRelevantChunks(message, documents, 4);

    const citations = relevantChunks.map((c, i) => ({
      id: i + 1,
      documentTitle: c.documentTitle,
      snippet: c.chunkText.slice(0, 180) + '...',
      score: (c.score * 100).toFixed(1) + '%'
    }));

    const contextText = relevantChunks.map((c, i) => `[Source ${i+1}: ${c.documentTitle}]\n${c.chunkText}`).join('\n\n---\n\n');

    const prompt = `You are Study HUB AI Assistant. 
Base your response STRICTLY on the uploaded study document snippets provided below.
If the answer is found in the context, explain it clearly with references like [Source 1] or [Source 2].
If the question cannot be answered using the provided context, state: "Based on your uploaded study notes, I could not find a direct answer to this specific query. However, here is what relates to it:" followed by any helpful related context from the notes.

User Question: ${message}

Extracted Document Context:
${contextText}`;

    try {
      const model = getGenerativeModel('gemini-1.5-flash');
      if (!model) {
        throw new Error('No Gemini API key');
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answerText = response.text();

      return res.json({
        answer: answerText,
        citations
      });
    } catch (aiErr) {
      console.warn('[ChatController] Gemini chat fallback:', aiErr.message);
      // Smart Fallback answer grounded in highest scoring chunk
      const bestChunk = relevantChunks[0];
      const fallbackAnswer = bestChunk 
        ? `Based on your document **"${bestChunk.documentTitle}"** [Source 1]:\n\n${bestChunk.chunkText}\n\n*Note: Configure your \`GEMINI_API_KEY\` in the top settings bar for live generative multi-turn AI responses.*`
        : `I found references to your query in your study documents. Here is the relevant snippet:\n\n${relevantChunks.map(c => `• **${c.documentTitle}**: ${c.chunkText.slice(0, 200)}...`).join('\n')}`;

      return res.json({
        answer: fallbackAnswer,
        citations
      });
    }

  } catch (error) {
    console.error('[ChatController] Chat error:', error);
    return res.status(500).json({ error: `Chat processing failed: ${error.message}` });
  }
}

module.exports = { handleChat };
