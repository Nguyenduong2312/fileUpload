const express = require('express');
const router = express.Router();

const logoutController = require('../app/controllers/LogoutController');

router.post('/', logoutController.logout);

module.exports = router;
