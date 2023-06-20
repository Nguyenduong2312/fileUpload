const Account = require('../models/Account');
const bcrypt = require('bcrypt');
var eccrypto = require('eccrypto');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

class LoginController {
    // [POST] /login
    login(req, res, next) {
        const { username, password, publicKey } = req.body;
        if (!username) {
            return res.status(220).send('Username can be empty.');
        } else if (!req.body.password) {
            return res.status(220).send('Password can be empty.');
        }

        //check privateKey
        console.log('publicKey: ', publicKey);

        //if false
        ////retuen res.status(220).send('Private key không đúng')

        //Xử lý
        Account.findOne({ username: username })
            .then((account) => {
                if (!account) {
                    return res.status(220).send('Username does not exist.');
                } else {
                    bcrypt.compare(
                        password,
                        account.password,
                        function (err, result) {
                            if (result) {
                                if (publicKey == account.publicKey) {
                                    return res.status(200).json({
                                        token: generateToken(account._id),
                                    });
                                } else {
                                    return res
                                        .status(220)
                                        .send('Public key is not registered.');
                                }
                            } else {
                                return res
                                    .status(220)
                                    .send('Password is incorrect.');
                            }
                        },
                    );
                }
            })
            .catch(next);
    }

    getUser(req, res) {
        console.log('get user');
        Account.findOne({ id: req.params.id })
            .then((account) => {
                res.send(account);
            })
            .catch(() => {
                res.send('null');
            });
    }

    getUserById(req, res) {
        Account.findOne({ _id: req.params.id })
            .then((account) => {
                res.send(account);
            })
            .catch(() => {
                res.send('null');
            });
    }

    user(req, res) {
        Account.findOne({ _id: req.user._id })
            .then((account) => {
                res.send(account);
            })
            .catch((err) => {
                res.send('Not authorized');
                console.log(err);
            });
    }

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

                tmp.publicKey = req.body.publicKey; //
                tmp.blockchainAddress = req.body.blockchainAddress;
                //tmp.privateKey = JSON.stringify(req.body.privateKey)
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

module.exports = new LoginController();
