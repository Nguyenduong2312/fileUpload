const express = require('express');
const router = express.Router();

const UploadRecordController = require('../app/controllers/UploadRecordController');

router.post('/', UploadRecordController.upload);
router.get('/find', UploadRecordController.findKey);

module.exports = router;
