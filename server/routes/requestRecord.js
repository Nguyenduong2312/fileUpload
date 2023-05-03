const express = require('express');
const router = express.Router();

const RequestController = require('../app/controllers/RequestController');
const UploadDrive = require('../app/controllers/UploadToDrive');

router.post('/', UploadDrive.upload);
router.get('/', RequestController.getRequest);
router.get('/receiver', RequestController.getRequestByReceiverId);
router.get('/sender', RequestController.getRequestBySenderId);
router.put('/:id', RequestController.updateRequest);
router.delete('/:id', RequestController.deleteRequest);
module.exports = router;
