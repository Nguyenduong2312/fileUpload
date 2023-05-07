const express = require('express');
const router = express.Router();

const UploadRecordController = require('../app/controllers/UploadRecordController');

router.post('/', UploadRecordController.upload);
router.get('/', UploadRecordController.getRecord);
router.get('/receiver/:id', UploadRecordController.getRecordByReceiverId);
router.get('/sender/:id', UploadRecordController.getRecordBySenderId);
router.get('/download/:id', UploadRecordController.downloadRecord);

module.exports = router;
