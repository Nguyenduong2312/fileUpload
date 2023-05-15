const RelationshipRequest = require('../models/MembershipRequest');
const Account = require('../models/Account');
const AccountController = require('./RegisterController');

class MembershipController{
    getRequestfromSender(req, res){
        RelationshipRequest.find({senderId:req.params.id}).then(function (request) {
            res.status(200).json(request);
        });
    }

    getRequestfromReceiver(req, res){
        RelationshipRequest.find({receiverId:req.params.id , status: "Waitting"}).then(function (request) {
            res.status(200).json(request);
        });
    }

    request(req,res){
        if(req.body.id === null ||
            req.body.role === null){
            return res.send('Id and role can not be empty')
        }
        Account.findOne({id: req.body.receiverId})
        .then((account) => {
            if(!account || 
                req.body.receiverId === req.session.user.id ||
                account.role === 'Doctor'){
                return res.send('User is not exists.')
            }
            RelationshipRequest.findOne({senderId:req.session.user.id, receiverId:req.body.receiverId})
            .then((request) => {
                if(request && request.status === "Waitting"){
                    return res.send('Request has already sent before.')
                }
                else{
                    const request = new RelationshipRequest()
                    request.senderId = req.session.user.id
                    request.senderName = req.session.user.name

                    request.receiverName = account.name
                    request.receiverId = req.body.receiverId

                    request.receiverRole = req.body.receiverRole
                    if(request.receiverRole === 'Child' &&  req.session.user.gender === 'Female') {
                        request.senderRole = 'Mother'
                    }
                    else if(request.receiverRole === 'Child' &&  req.session.user.gender === 'Male') {
                        request.senderRole = 'Father'
                    }
                    else if(request.receiverRole === 'Child'){
                        request.senderRole = 'Parent'
                    }
                    else{
                        request.senderRole = 'Child'
                    }

                    request.save()   
                    .then(() => res.send('Sendd success' ))
                    .catch(() => res.send('Sendd fail' ));        
                }
            })
        });
    }

    updateRequest(req,res){
        const roleForReceiver = {[req.body.senderId]:req.body.senderRole}
        const roleForSender = {[req.body.receiverId]:req.body.receiverRole}

        AccountController.AddRelationshipForUser(req.body.receiverId,roleForReceiver) // add for receiver
        AccountController.AddRelationshipForUser(req.body.senderId,roleForSender) // add for sender
        
        RelationshipRequest.findOne({_id:req.body._id})
        .then((request) => {
            request.status = 'Accepted';
            request.save();
        })
        res.send('abc')        
    }

    deleteRequest(req,res){
        RelationshipRequest.findOneAndRemove({_id: req.params.id})
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }));
    }
}

module.exports = new MembershipController();
