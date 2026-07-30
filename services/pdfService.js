const { parseFileContent } = require('./fileParserService');

exports.extractPdfText = async (filePath) => {
  return await parseFileContent(filePath, '.pdf');
};
