const express = require('express');
const router = express.Router();

const loginController = require('../app/controllers/LoginController');

router.post('/', loginController.login);
router.get('/user', loginController.user);
router.get('/logout', loginController.logout);
router.get('/:id', loginController.getUser);
module.exports = router;
