const Account = require('../models/Account');
var eccrypto = require('eccrypto');

class RegisterController {
    // [POST] /register
    createAccount(req, res, next) {
        // Check input data
        if (
            req.username === null ||
            req.password1 === null ||
            req.password2 === null
        ) {
            res.status(400).json({ status: false });
        } else if (req.password1 !== req.password2) {
            res.status(400).json({ status: false });
        }
        const { username, password1 } = req.body; //lấy được username & password
        //Xử lý
        const account = new Account();
        account.username = username;
        console.log(account.username);
        account.password = password1;
        account.role = 'patient';

        const privateKey = eccrypto.generatePrivate()
        account.privateKey = JSON.stringify(privateKey);
        account.publicKey = JSON.stringify(eccrypto.getPublic(privateKey));
        console.log(account.publicKey,account.privateKey);
        account
            .save()
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
        //Nếu user hợp lệ return true
    }
}

module.exports = new RegisterController();
