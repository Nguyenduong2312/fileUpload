const express = require('express');
const router = express.Router();

const loginController = require('../app/controllers/LoginController');

router.post('/', loginController.login);
router.get('/checkLogin', loginController.checkLogin);
router.get('/user', loginController.user);
router.get('/logout', loginController.logout);

module.exports = router;
