const express = require('express');
const router = express.Router();

const loginController = require('../app/controllers/LoginController');
const { protect, checkPatient } = require('../app/controllers/authenticate');

router.post('/', loginController.login);
router.get('/user', protect, loginController.user);
router.get('/:id', loginController.getUserById);
router.get('/id/:id', loginController.getUser);

router.get('/patient/:id', checkPatient, loginController.getUser);
module.exports = router;
