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
        console.log('request', req.body);
        if (!req.body.id || !req.body.role) {
            return res.json({ msg: 'Id and role can not be empty' });
        }
        Account.findOne({ id: req.body.id }).then((account) => {
            if (
                !account ||
                req.body.id === req.user.id ||
                account.role === 'Doctor'
            ) {
                console.log('invalid');
                return res.json({ msg: 'User is not exists or invalid.' });
            }
            console.log('true');
            RelationshipRequest.findOne({
                senderId: req.user.id,
                receiverId: req.body.id,
            }).then((request) => {
                if (request && request.status === 'Waitting') {
                    return res.json({
                        msg: 'Request has already been sent before. Waiting for receiver to accept it.',
                    });
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
                    console.log('request', request);
                    request
                        .save()
                        .then(() => res.json({ msg: 'Send success' }))
                        .catch(() => res.json({ msg: 'Send fail' }));
                }
            });
        });
    }

    updateRequest(req, res) {
        console.log('updateRequest', req.body);
        console.log('req.params.id', req.params.id);
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
            .then(() => res.json({ msg: 'Accepted' }))
            .catch(() => res.json({ msg: 'Err' }));
    }

    deleteRequest(req, res) {
        RelationshipRequest.findOneAndRemove({ _id: req.params.id })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
    }
}

module.exports = new MembershipController();
