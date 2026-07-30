const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../config/multer');

router.post('/', upload.single('file'), uploadController.uploadFile);
router.get('/', uploadController.getUploadedFiles);
router.delete('/:id', uploadController.deleteFile);

module.exports = router;
