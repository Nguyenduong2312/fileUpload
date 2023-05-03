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
                        _id: account._id,
                        privateKey: account.privateKey,
                    };
                    res.status(200).json({ status: true });
                }
            })
            .catch(next);
        //Nếu user hợp lệ return true
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
