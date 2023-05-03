const Account = require('../models/Account');

class LogoutController {
    // [POST] /logout
    logout(req, res, next) {
        // Destroy a session
        req.session.destroy(function (err) {
            return res
                .status(200)
                .json({
                    status: 'success',
                    session: 'cannot access session here',
                });
        });
    }
}

module.exports = new LogoutController();
