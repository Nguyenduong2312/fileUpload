const express = require('express');
const router = express.Router();

const acceptedRequest = require('../app/controllers/AcceptedRequestController');


router.get('/:id', acceptedRequest.getRecord);

module.exports = router;
