const Account = require('../models/Account');
var eccrypto = require('eccrypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

class RegisterController {
    createAccount(req, res) {
        if (
            !req.body.username ||
            !req.body.password1 ||
            !req.body.password2 ||
            !req.body.role
        ) {
            return res.status(220).send('This field can be empty.');
        } else if (req.password1 !== req.password2) {
            return res
                .status(220)
                .send("Those passwords didn't match. Try again.");
        }
        Account.findOne({ username: req.body.username }).then((account) => {
            if (account) {
                return res
                    .status(220)
                    .send('That username is taken. Try another.');
            } else {
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
                        if (lastAccount) {
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
                                        //req.session.user = account;
                                        res.status(200).json({
                                            token: generateToken(account._id),
                                        });
                                    })
                                    .catch(() => {
                                        res.status(500).send('');
                                    });
                            },
                        );
                    })
                    .catch(() => {
                        res.status(500).send('');
                    });
            }
        });
    }

    AddRelationshipForUser(idUser, role) {
        Account.findOne({ id: idUser }).then((account) => {
            for (let key in role) {
                account.relationship = {
                    ...account.relationship,
                    [key]: role[key],
                };
            }
            //account.relationship = {}
            account.save();
        });
    }
}

module.exports = new RegisterController();
