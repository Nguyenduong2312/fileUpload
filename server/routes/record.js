const express = require('express');
const router = express.Router();

const RecordController = require('../app/controllers/RecordController');

router.post('/', RecordController.upload);
router.get('/:id', RecordController.getRecordById);
router.get('/received/:id', RecordController.getReceivedRecordById);
router.get('/download/:id', RecordController.downloadRecord);
module.exports = router;
