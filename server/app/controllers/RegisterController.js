const Account = require('../models/Account');
var eccrypto = require('eccrypto');

class RegisterController {
    // [POST] /register
    createAccount(req, res) {
        // Check input data
        if (
            req.username === null ||
            req.password1 === null ||
            req.password2 === null
        ) {
            res.status(400).json({ status: false });
        } else if (req.password1 !== req.password2) {
            res.status(400).json({ status: false });
        }
        //Xử lý
        req.body.password = req.body.password1;
        req.body.role = 'patient';

        const privateKey = eccrypto.generatePrivate();
        req.body.privateKey = JSON.stringify(privateKey);
        req.body.publicKey = JSON.stringify(eccrypto.getPublic(privateKey));

        Account.findOne({})
            .lean()
            .sort({ id: 'desc' })
            .then((lastAccount) => {
                if (lastAccount) {
                    req.body._id = lastAccount._id + 1;
                } else {
                    req.body._id = 1;
                }

                const account = new Account(req.body);
                account
                    .save()
                    .then(() => res.json({ status: true }))
                    .catch(() => res.json({ status: false }));
            })
            .catch(() => res.json({ status: false }));
        //Nếu user hợp lệ return true
    }
}

module.exports = new RegisterController();
