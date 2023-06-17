const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/Account');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            return res.send(faslse);
            //throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const checkPatient = asyncHandler(async (req, res, next) => {
    console.log('checkPatient', req.params.id || req.body.id);

    User.findOne({ id: req.params.id || req.user.id, role: 'Patient' })
        .then((account) => {
            if (account) {
                next();
            } else {
                res.send(false);
            }
        })
        .catch(() => {
            res.send(false);
        });
});

module.exports = { protect, checkPatient };
