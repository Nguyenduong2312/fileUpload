const Account = require('../models/Account');
const bcrypt = require('bcrypt');

class LoginController {
    // [POST] /login
    login(req, res, next) {
        if (!req.body.username) {
            return res.status(220).send('Username can be empty.');
        } else if (!req.body.password) {
            return res.status(220).send('Password can be empty.');
        }
        const { username, password } = req.body; //lấy được username & password

        //Xử lý
        Account.findOne({ username: username })
            .lean()
            .then((account) => {
                if (!account) {
                    return res.status(220).send('Username does not exist.');
                } else {
                    bcrypt.compare(
                        password,
                        account.password,
                        function (err, result) {
                            if (result) {
                                req.session.user = account;
                                return res.status(200).send('');
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

    logout(req, res, next) {
        // Destroy a session
        req.session.destroy(function (err) {
            return res.status(200).json({
                status: 'success',
                session: 'cannot access session here',
            });
        });
    }
    //login/:id
    getUser(req, res) {
        Account.findOne({ id: req.params.id })
            .then((account) => {
                res.send(account);
            })
            .catch(() => {
                res.send('null');
            });
    }

    // [GET] /login/user
    user(req, res) {
        Account.findOne({ id: req.session?.user?.id }).then((account) => {
            res.send(account);
        });
    }

    checkPatient(req, res) {
        Account.findOne({ id: req.params.id, role: 'Patient' })
            .then((account) => {
                if (account) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            })
            .catch(() => {
                res.send(false);
            });
    }
}

module.exports = new LoginController();

// Get the current logged in user
// if(req.session.User){
// Get user's id/private key
//        var pKey = req.session.User.privateKey;
//     return res.status(200).json({status: 'success', session: req.session.User})
// }
// return res.status(200).json({status: 'error', session: 'No session'})
