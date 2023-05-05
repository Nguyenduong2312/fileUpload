const Account = require('../models/Account');
const user = {
    name: "Amar",
    Roll_number: 43,
    Address: "Pune"
};

class LoginController {
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
                } else if (account.password !== password) {
                    res.status(400).json({ status: false });
                } else {
                    req.session.user = {
                        _id: account._id,
                        privateKey: account.privateKey,
                    };
                    res.status(200).json({ status: true });
                }
            })
            .catch(next);
    }
    checkLogin(req,res){
        if (req.session.user){
            res.status(200).json({ status: true});
        }
        else{
            res.status(400).json({ status: false});
        }

    }
    user(req,res){
        const sessionuser = req.session.user;
        res.send(sessionuser);
    }
    logout(req,res){
        req.session.destroy();
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
