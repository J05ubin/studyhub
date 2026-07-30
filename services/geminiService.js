const { getGenerativeModel } = require('../config/gemini');

exports.generateContent = async (prompt, modelName = 'gemini-1.5-flash') => {
  const model = getGenerativeModel(modelName);
  if (!model) throw new Error('Gemini API is not initialized. Please check your API key.');
  const result = await model.generateContent(prompt);
  return result.response.text();
};
