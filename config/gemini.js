const { GoogleGenerativeAI } = require('@google/generative-ai');

let customApiKey = null;

const setApiKey = (key) => {
  if (key && typeof key === 'string' && key.trim().length > 0) {
    customApiKey = key.trim();
  }
};

const getApiKey = () => {
  return customApiKey || process.env.GEMINI_API_KEY || '';
};

const getGeminiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const getGenerativeModel = (modelName = 'gemini-1.5-flash') => {
  const ai = getGeminiClient();
  if (!ai) return null;
  return ai.getGenerativeModel({ model: modelName });
};

const getEmbeddingModel = (modelName = 'text-embedding-004') => {
  const ai = getGeminiClient();
  if (!ai) return null;
  return ai.getGenerativeModel({ model: modelName });
};

module.exports = {
  setApiKey,
  getApiKey,
  getGeminiClient,
  getGenerativeModel,
  getEmbeddingModel
};
