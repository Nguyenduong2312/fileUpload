const express = require('express');
const router = express.Router();

const UploadRecordController = require('../app/controllers/UploadRecordController');

router.post('/', UploadRecordController.login);
console.log('ab');
module.exports = router;
