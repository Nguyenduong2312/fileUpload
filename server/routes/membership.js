const express = require('express');
const router = express.Router();

const membershipController = require('../app/controllers/MembershipController');

router.post('/', membershipController.request);
router.get('/sender/:id', membershipController.getRequestfromSender);
router.get('/receiver/:id', membershipController.getRequestfromReceiver);
router.put('/:id', membershipController.updateRequest);
router.delete('/:id', membershipController.deleteRequest);
module.exports = router;
