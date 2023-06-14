const express = require('express');
const router = express.Router();

const RecordController = require('../app/controllers/RecordController');
const { protect } = require('../app/controllers/authenticate');

router.post('/', protect, RecordController.upload);
router.get('/:id', RecordController.getRecordById);
router.get('/received/:id', RecordController.getReceivedRecordById);
router.get('/download/:id', RecordController.downloadRecord);
router.delete('/:id', RecordController.deleteRecord);

module.exports = router;
