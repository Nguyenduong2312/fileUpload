const Account = require('../models/Account');

class UpdateAccountController {
    getInfor(req, res) {
        Account.findOne({ _id: req.params.id }).then((account) => {
            res.status(200).json(account);
        });
    }
    update(req, res) {
        Account.findOne({ id: req.params.id })
            .then((account) => {
                if (req.body.name) {
                    account.name = req.body.name;
                }
                if (req.body.gender) {
                    account.gender = req.body.gender;
                }
                if (req.body.address) {
                    account.address = req.body.address;
                }
                if (req.body.email) {
                    account.email = req.body.email;
                }
                if (req.body.date) {
                    account.birthday = req.body.date;
                }
                account
                    .save()
                    .then(() => {
                        res.send('Information is updated!');
                    })
                    .catch(() => res.json({ status: false }));
            })
            .catch(() => res.json({ status: false }));
    }
}

module.exports = new UpdateAccountController();
