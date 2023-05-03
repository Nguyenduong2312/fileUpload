const express = require('express');
const router = express.Router();

const UploadRecordController = require('../app/controllers/UploadRecordController');

router.post('/', UploadRecordController.upload);
router.get('/', UploadRecordController.getRecord);
router.get('/receiver', UploadRecordController.getRecordByReceiverId);
router.get('/sender', UploadRecordController.getRecordBySenderId);
router.get('/download/:id', UploadRecordController.downloadRecord);

module.exports = router;
