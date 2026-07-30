const documentController = require('./documentController');

module.exports = {
  uploadFile: documentController.uploadDocument,
  getUploadedFiles: documentController.getDocuments,
  deleteFile: documentController.deleteDocument
};
