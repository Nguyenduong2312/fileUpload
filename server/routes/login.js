const express = require('express');
const router = express.Router();

const AccountController = require('../app/controllers/LoginController');
const { protect, checkPatient } = require('../app/controllers/authenticate');

router.post('/login', AccountController.login);
router.post('/signup', AccountController.createAccount);
router.get('/user', protect, AccountController.user);
router.get('/:id', AccountController.getUserById);
router.get('/id/:id', AccountController.getUser);

router.get('/patient/:id', checkPatient, AccountController.getUser);
module.exports = router;
