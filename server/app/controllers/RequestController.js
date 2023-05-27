const Request = require('../models/Request');
const Record = require('../models/Record');
const Account = require('../models/Account');
const AcceptedRequest = require('../models/AcceptedRequest');

class RequestController{
    getRequest(req, res) {
        Request.find().then(function (request) {
            res.status(200).json(request);
        });
    }
    getRequestByReceiverId(req,res) {
        Request.find({idReceiver: req.params.id, status: 'Waitting'})
        .then(function(request){
            res.status(200).json(request)
        })
    }
    getRequestBySenderId(req,res) {
        Request.find({idSender: req.params.id, status: 'Waitting'})
        .then(function(request){
            res.status(200).json(request)
        })
    }

    getAcceptedBySenderId(req,res) {
        Request.find({idSender: req.params.id, status: 'Accepted'})
        .then(function(request){
            res.status(200).json(request)
        })
    }

    request(req,res){
        const {idReceiver, idRecord, nameRecord} = req.body
        Request.findOne({idSender: req.session.user.id, idReceiver: idReceiver, idRecord: idRecord, status: "Waitting"})
        .then((request) => {
            if(request){
                res.send('Request has already sent before. Waitting receiver accepted it.')
            }
            else {
                const request = new Request()
                request.idReceiver = idReceiver
                request.idSender = req.session.user.id
                request.idRecord = idRecord
                request.nameRecord = nameRecord
                request.save()
                .then(() => res.send('Send request successful'))
                .catch(()  => res.send('Send request fail'))
            }
        })
    }
    updateRequest(req,res){
        Request.findOne({_id: req.params.id})
        .then((request) => {
            request.status = 'Accepted'
            request.save()
            .then(() => 
                res.send(`Accepted request from ${req.body.idSender}`)
            )
            .catch(() => 
                res.send(`Error!`)
            );
        })
        //
    }
    deleteRequest(req,res){
        Request.findOneAndRemove({_id: req.params.id})
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }));
    }
}

module.exports = new RequestController();
