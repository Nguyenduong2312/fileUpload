const express = require('express');
const router = express.Router();

const UploadRecordController = require('../app/controllers/UploadRecordController');

router.post('/', UploadRecordController.upload);
router.get('/get', UploadRecordController.getRecord);
router.get('/download/:id', UploadRecordController.downloadRecord);

module.exports = router;
