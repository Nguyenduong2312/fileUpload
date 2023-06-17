const RelationshipRequest = require('../models/MembershipRequest');
const Account = require('../models/Account');
const AccountController = require('./LoginController');

class MembershipController {
    getRequestfromSender(req, res) {
        RelationshipRequest.find({ senderId: req.params.id }).then(function (
            request,
        ) {
            res.status(200).json(request);
        });
    }

    getRequestfromReceiver(req, res) {
        RelationshipRequest.find({
            receiverId: req.params.id,
            status: 'Waitting',
        }).then(function (request) {
            res.status(200).json(request);
        });
    }

    request(req, res) {
        if (!req.body.id || !req.body.role) {
            return res.send('Id and role can not be empty');
        }
        Account.findOne({ id: req.body.id }).then((account) => {
            if (
                !account ||
                Number(req.body.id) === req.user.id ||
                account.role === 'Doctor'
            ) {
                return res.send('User is not exists or invalid.');
            }
            RelationshipRequest.findOne({
                senderId: req.user.id,
                receiverId: req.body.id,
            }).then((request) => {
                if (request && request.status === 'Waitting') {
                    return res.send(
                        'Request has already been sent before. Waiting for receiver to accept it.',
                    );
                } else {
                    const request = new RelationshipRequest();
                    request.senderId = req.user.id;
                    request.senderName = req.user.name;

                    request.receiverName = account.name;
                    request.receiverId = req.body.id;

                    request.receiverRole = req.body.role;
                    if (
                        request.receiverRole === 'Child' &&
                        req.user.gender === 'Female'
                    ) {
                        request.senderRole = 'Mother';
                    } else if (
                        request.receiverRole === 'Child' &&
                        req.user.gender === 'Male'
                    ) {
                        request.senderRole = 'Father';
                    } else if (request.receiverRole === 'Child') {
                        request.senderRole = 'Parent';
                    } else {
                        request.senderRole = 'Child';
                    }

                    request
                        .save()
                        .then(() => res.send('Send success'))
                        .catch(() => res.send('Send fail'));
                }
            });
        });
    }

    updateRequest(req, res) {
        const roleForReceiver = { [req.body.senderId]: req.body.senderRole };
        const roleForSender = { [req.body.receiverId]: req.body.receiverRole };

        AccountController.AddRelationshipForUser(
            req.body.receiverId,
            roleForReceiver,
        ); // add for receiver
        AccountController.AddRelationshipForUser(
            req.body.senderId,
            roleForSender,
        ); // add for sender

        RelationshipRequest.findOneAndRemove({ _id: req.params.id })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));

        res.status(200);
    }

    deleteRequest(req, res) {
        RelationshipRequest.findOneAndRemove({ _id: req.params.id })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
    }
}

module.exports = new MembershipController();
