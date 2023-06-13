const express = require('express');
const router = express.Router();

const RequestController = require('../app/controllers/RequestController');
const { protect } = require('../app/controllers/authenticate');

router.post('/', protect, RequestController.request);
router.get('/', RequestController.getRequest);
router.get('/receiver/:id', RequestController.getRequestByReceiverId);
router.get('/sender/:id', RequestController.getRequestBySenderId);
router.get('/accepted/sender/:id', RequestController.getAcceptedBySenderId);

router.put('/:id', RequestController.updateRequest);
router.delete('/:id', RequestController.deleteRequest);
module.exports = router;
