const Account = require('../models/Account');
var eccrypto = require('eccrypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class RegisterController {
    // [POST] /register
    createAccount(req, res) {
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

        // Create temporary account object to assign value
        const tmp = new Account();
        tmp.username = req.body.username;
        const privateKey = eccrypto.generatePrivate();
        tmp.privateKey = JSON.stringify(privateKey);
        tmp.publicKey = JSON.stringify(eccrypto.getPublic(privateKey));
        tmp.role = req.body.role;

        // Increment id
        Account.findOne({})
            .lean()
            .sort({ id: 'desc' })
            .then((lastAccount) => {
                if (lastAccount.id) {
                    tmp.id = lastAccount.id + 1;
                } else {
                    tmp.id = 1;
                }

                // Hash password
                bcrypt.hash(
                    req.body.password1,
                    saltRounds,
                    function (err, hash) {
                        tmp.password = hash;

                        // Create another account with assigned value and save to database
                        const account = new Account(tmp);
                        account
                            .save()
                            .then(() => {
                                res.json({ status: true });
                            })
                            .catch(() => {
                                res.json({ status: false });
                            });
                    },
                );
            })
            .catch(() => res.json({ status: false }));
    }
}

module.exports = new RegisterController();
