const Account = require('../models/Account');
const bcrypt = require('bcrypt');

class LoginController {
    // [POST] /login
    login(req, res, next) {
        if (req.username === null) {
            res.status(400).json({ status: false });
        } else if (req.password === null) {
            res.status(400).json({ status: false });
        }
        const { username, password } = req.body; //lấy được username & password

        //Xử lý
        Account.findOne({ username: username })
            .lean()
            .then((account) => {
                if (!account) {
                    res.status(400).json({ status: false });
                } else {
                    bcrypt.compare(
                        password,
                        account.password,
                        function (err, result) {
                            if (result) {
                                req.session.user = account;
                                res.status(200).json({ status: true });
                            } else {
                                res.status(400).json({ status: false });
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
            return res
                .status(200)
                .json({
                    status: 'success',
                    session: 'cannot access session here',
                });
        });
    }
    //login/:id
    getUser(req,res){
        Account.findOne({id: req.params.id})
        .then((account) => {
            res.send(account)
        })
        .catch(() => {
            res.send('null')
        })
    }

    // [GET] /login/user
    user(req, res) {
        Account.findOne({id: req.session?.user?.id})
        .then((account) => {
            res.send(account)
        })
    }

    checkPatient(req,res){
        console.log('req1:', req.body);
        console.log('req pra', req.params.id);
        Account.findOne({id: req.params.id, role: "Patient"})
        .then((account) => {
            console.log(account);
            if(account){
                res.send(true)
            }
            else{
                res.send(false)
            }
        })
        .catch(() => {
            res.send(false)
        })
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
