const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract raw text from uploaded PDF, DOCX, or TXT file
 * @param {string} filePath 
 * @param {string} mimeType 
 * @param {string} originalName 
 * @returns {Promise<string>}
 */
async function extractTextFromFile(filePath, mimeType, originalName = '') {
  const ext = originalName.split('.').pop().toLowerCase();

  try {
    if (mimeType === 'application/pdf' || ext === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || '';
    } 
    
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }

    // Default: Plain text files (.txt, .md, .csv, etc.)
    const textContent = fs.readFileSync(filePath, 'utf-8');
    return textContent || '';
  } catch (error) {
    console.error(`[FileParser] Error parsing file ${originalName}:`, error);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
}

module.exports = { extractTextFromFile };
