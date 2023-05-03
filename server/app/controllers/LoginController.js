const Account = require('../models/Account');

class LoginController {
    // checklogin(req, res) {
    //     var user = req.session.user;
    //     console.log(user);
    //     if (user == null) {
    //         return false;
    //     } else {
    //         //req.user = user;
    //         return true;
    //     }
    // }

    // [POST] /login
    login(req, res, next) {
        if (req.username === null) {
            res.status(400).json({ status: false });
        } else if (req.password === null) {
            res.status(400).json({ status: false });
        }
        const { username, password } = req.body; //lấy được username & password
        console.log(username);
        //Xử lý
        Account.findOne({ username: username })
            .lean()
            .then((account) => {
                if (!account) {
                    res.status(400).json({ status: false });
                } else if (account.password !== password) {
                    res.status(400).json({ status: false });
                } else {
                    req.session.User = {
                        website: 'anonystick.com',
                        type: 'blog javascript',
                        like: '4550',
                    };
                    res.status(200).json({ status: true });
                    console.log(req.session.User);
                }
            })
            .catch(next);
        //Nếu user hợp lệ return true
    }
}

module.exports = new LoginController();
