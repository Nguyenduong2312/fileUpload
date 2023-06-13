const express = require('express');
const router = express.Router();

const membershipController = require('../app/controllers/MembershipController');
const { protect } = require('../app/controllers/authenticate');

router.post('/', protect, membershipController.request);
router.get('/sender/:id', membershipController.getRequestfromSender);
router.get('/receiver/:id', membershipController.getRequestfromReceiver);
router.put('/:id', membershipController.updateRequest);
router.delete('/:id', membershipController.deleteRequest);
module.exports = router;
