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
        console.log('login');
        console.log('req:', req.body);
        const { username, password } = req.body;
        if (!username) {
            return res.status(220).json({ msg: 'Username can be empty.' });
        } else if (!req.body.password) {
            return res.status(220).json({ msg: 'Password can be empty.' });
        }

        //Xử lý
        Account.findOne({ username: username })
            .then((account) => {
                if (!account) {
                    return res
                        .status(220)
                        .json({ msg: 'Username does not exist.' });
                } else {
                    bcrypt.compare(
                        password,
                        account.password,
                        function (err, result) {
                            if (result) {
                                return res.status(200).json({
                                    token: generateToken(account._id),
                                });
                            } else {
                                return res
                                    .status(220)
                                    .json({ msg: 'Password is incorrect.' });
                            }
                        },
                    );
                }
            })
            .catch(next);
    }

    getUser(req, res) {
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
        Account.findOne({ _id: req.user._id }).then((account) => {
            res.send(account);
        });
    }

    createAccount(req, res) {
        console.log('req: ', req.body);
        console.log('req: ', req.body.password2);
        if (!req.body.username || !req.body.password1 || !req.body.password2) {
            return res.status(220).json({ msg: 'This field can be empty.' });
        } else if (req.password1 !== req.password2) {
            return res
                .status(220)
                .json({ msg: "Those passwords didn't match. Try again." });
        }
        Account.findOne({ username: req.body.username }).then((account) => {
            if (account) {
                return res
                    .status(220)
                    .json({ msg: 'That username is taken. Try another.' });
            } else {
                // Create temporary account object to assign value
                const tmp = new Account();
                tmp.username = req.body.username;
                tmp.role = req.body.role;
                const privateKey = eccrypto.generatePrivate();
                tmp.privateKey = JSON.stringify(privateKey);
                tmp.publicKey = JSON.stringify(eccrypto.getPublic(privateKey));
                // Increment id
                Account.findOne({})
                    .lean()
                    .sort({ id: 'desc' })
                    .then((lastAccount) => {
                        //console.log('la: ', lastAccount);
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
                                console.log('acc: ', account);

                                account
                                    .save()
                                    .then(() => {
                                        return res.status(200).json({});
                                    })
                                    .catch(() => {
                                        console.log('khong save');
                                        return res
                                            .status(500)
                                            .json({ msg: 'Error' });
                                    });
                            },
                        );
                    })
                    .catch(() => {
                        return res.status(500).json({ msg: 'Error' });
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
