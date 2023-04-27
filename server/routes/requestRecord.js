const express = require('express');
const router = express.Router();

const RequestController = require('../app/controllers/RequestController');

router.post('/', RequestController.request);
router.get('/', RequestController.getRequest);
router.put('/:id', RequestController.updateRequest);
router.delete('/:id', RequestController.deleteRequest);
module.exports = router;
