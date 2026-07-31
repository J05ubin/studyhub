const { getDocumentsForRAG } = require('./documentController');
const { generateRAGContent, parseCleanJSON } = require('../services/ragService');
const { PROMPTS } = require('../utils/prompts');
const fallbackService = require('../services/fallbackService');

/**
 * Universal handler for AI Study Tools
 */
async function handleAIToolRequest(req, res) {
  try {
    const { toolType } = req.params;
    const { documentId, options = {} } = req.body;

    console.log(`[AIToolController] Invoking tool: ${toolType} for docId: ${documentId || 'all'}`);

    const documents = await getDocumentsForRAG(documentId);
    const docTitle = documents && documents.length > 0 ? (documents[0].title || documents[0].originalName) : 'Study HUB Material';

    try {
      let rawResponse = '';
      let promptFn = PROMPTS[toolType];

      if (!promptFn) {
        return res.status(400).json({ error: `Unknown tool type: ${toolType}` });
      }

      rawResponse = await generateRAGContent(promptFn, documents, options.query || '', options);

      // JSON parsing tools
      const jsonTools = [
        'detailedNotes', 'mcqGenerator', 'quizGenerator', 'practiceTest',
        'flowchartGenerator', 'mindmapGenerator', 'flashcards', 'importantQuestions',
        'vivaQuestions', 'interviewQuestions'
      ];

      if (jsonTools.includes(toolType)) {
        const parsed = parseCleanJSON(rawResponse);
        return res.json({ success: true, toolType, data: parsed });
      } else {
        // Markdown response tools: shortNotes, smartSummary
        return res.json({ success: true, toolType, data: rawResponse });
      }

    } catch (aiError) {
      console.warn(`[AIToolController] Gemini AI generation error for ${toolType}: ${aiError.message}. Utilizing smart fallback generator.`);

      let fallbackData = null;

      switch (toolType) {
        case 'detailedNotes':
          fallbackData = fallbackService.generateFallbackDetailedNotes(docTitle);
          break;
        case 'shortNotes':
          fallbackData = `### 📌 Short Notes: ${docTitle}\n\n` +
            `* **Core Principle**: Retrieval-Augmented Generation (RAG) grounds AI in user notes.\n` +
            `* **Architecture**: Express MVC backend with Vector Embeddings and MongoDB Atlas.\n` +
            `* **High-Yield Terms**: Active Recall, Spaced Repetition, Cosine Similarity, Embeddings.\n` +
            `* **Exam Tip**: Write clear structural diagrams and emphasize definitions.`;
          break;
        case 'smartSummary':
          fallbackData = `### 📊 Smart Summary: ${docTitle}\n\n` +
            `**1. Executive Overview**:\n` +
            `This study module introduces foundational technical principles and practical execution strategies. It covers structural design patterns and algorithm efficiency.\n\n` +
            `**2. Core Takeaways**:\n` +
            `• Modular software architecture improves code maintainability.\n` +
            `• Vector search enables semantic context retrieval.\n` +
            `• Regular self-testing increases long-term retention by over 70%.`;
          break;
        case 'mcqGenerator':
          fallbackData = fallbackService.generateFallbackMCQs(options.count || 5, options.difficulty || 'Medium');
          break;
        case 'quizGenerator':
          fallbackData = fallbackService.generateFallbackQuiz(options.count || 5, options.pattern || 'University');
          break;
        case 'practiceTest':
          fallbackData = fallbackService.generateFallbackQuiz(options.count || 10, options.pattern || 'University');
          break;
        case 'flowchartGenerator':
          fallbackData = fallbackService.generateFallbackFlowchart(docTitle);
          break;
        case 'mindmapGenerator':
          fallbackData = fallbackService.generateFallbackMindMap(docTitle);
          break;
        case 'flashcards':
          fallbackData = fallbackService.generateFallbackFlashcards(options.count || 8);
          break;
        case 'importantQuestions':
          fallbackData = fallbackService.generateFallbackImportantQuestions();
          break;
        case 'vivaQuestions':
          fallbackData = fallbackService.generateFallbackVivaQuestions();
          break;
        case 'interviewQuestions':
          fallbackData = fallbackService.generateFallbackInterviewQuestions();
          break;
        default:
          fallbackData = { message: "Generated fallback content." };
      }

      return res.json({ success: true, toolType, data: fallbackData, isFallback: true });
    }

  } catch (error) {
    console.error('[AIToolController] Critical error:', error);
    return res.status(500).json({ error: `Tool execution error: ${error.message}` });
  }
}

module.exports = { handleAIToolRequest };
