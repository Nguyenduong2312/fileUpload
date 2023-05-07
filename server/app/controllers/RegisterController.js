const Account = require('../models/Account');
var eccrypto = require('eccrypto');

class RegisterController {
    // [POST] /register
    createAccount(req, res) {
        const tmp = new Account();
        // Check input data
        if (
            !req.body.username ||
            !req.body.password1 ||
            !req.body.password2 ||
            !req.body.role
        ) {
            res.status(400).json({ status: false });
        } else if (req.password1 !== req.password2) {
            res.status(400).json({ status: false });
        }
        Account.findOne({ username: req.body.username }).then((account) => {
            if (account) {
                res.status(422).json({ status: false });
            }
        });

        tmp.username = req.body.username;
        tmp.password = req.body.password1;
        const privateKey = eccrypto.generatePrivate();
        tmp.privateKey = JSON.stringify(privateKey);
        tmp.publicKey = JSON.stringify(eccrypto.getPublic(privateKey));
        tmp.role = req.body.role;

        Account.findOne({})
            .lean()
            .sort({ id: 'desc' })
            .then((lastAccount) => {
                if (lastAccount) {
                    tmp.id = lastAccount.id + 1;
                } else {
                    tmp.id = 1;
                }

                const account = new Account(tmp);

                account
                    .save()
                    .then(() => {
                        req.session.user = account;
                        res.json({ status: true });
                    })
                    .catch(() => {
                        res.json({ status: false });
                    });
            })
            .catch(() => res.json({ status: false }));
        //Nếu user hợp lệ return true
    }
}

module.exports = new RegisterController();
