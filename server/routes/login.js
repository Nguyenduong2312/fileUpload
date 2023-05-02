const express = require('express');
const router = express.Router();
const passport = require('passport');

const loginController = require('../app/controllers/LoginController');

//router.get('/checkLogin', loginController.checklogin);
//router.post('/', loginController.login);
router.post(
    '/',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    },
);

module.exports = router;
