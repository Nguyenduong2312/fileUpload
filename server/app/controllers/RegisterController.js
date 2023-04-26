const Account = require('../models/Account');
var eccrypto = require('eccrypto');

class RegisterController {
    // [POST] /register
    createAccount(req, res) {
        console.log('cv');
        const account = new Account();
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
        //Xử lý
        account.role = 'patient';

        const privateKey = eccrypto.generatePrivate();
        account.privateKey = JSON.stringify(privateKey);
        account.publicKey = JSON.stringify(eccrypto.getPublic(privateKey));

        Account.findOne({})
            .lean()
            .sort({ id: 'desc' })
            .then((lastAccount) => {
                if (lastAccount) {
                    account.id = lastAccount.id + 1;
                } else {
                    account.id = 1;
                }
                account.username = req.body.username;
                account.password = req.body.password1;
                account
                    .save()
                    .then(() => {
                        res.json({ status: true });
                    })
                    .catch(() => {
                        res.json({ status: 'a' });
                    });
            })
            .catch(() => res.json({ status: "falsel" }));
        //Nếu user hợp lệ return true
    }
}

module.exports = new RegisterController();
