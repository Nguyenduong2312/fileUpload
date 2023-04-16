const express = require('express');
const router = express.Router();

const sessionController = require('../app/controllers/SessionController');

router.get('/set_session', sessionController.setSession);
router.get('/get_session', sessionController.getSession);
router.get('/delete_session', sessionController.deleteSession);

module.exports = router;
