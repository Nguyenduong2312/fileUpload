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
        Account.findOne({id: req.body.idBN})
        .then((account) => {
            if(!account || req.body.idBN === req.params.id){
                res.send('Patient is not exists')
            }
            else{
                Request.findOne({idSender: req.params.id, idReceiver: req.body.idBN})
                .then((request) => {
                    if(request){
                        res.send('Request has already sent before. Waitting sender accepted it.')
                    }
                    else {
                        const idReceiver = req.body.idBN;
                        const request = new Request()
                        request.idReceiver = idReceiver
                        request.idSender = req.params.id
                        request.save()
                        .then(() => res.send('Send request successful'))
                        .catch(()  => res.send('Send request fail'))
                    }
                })
                }
        })
    }
    updateRequest(req,res){
        Request.findOne({_id: req.params.id})
        .then((request) => {
            //
            console.log('body:', req.body);
            const acceptedRequest = new AcceptedRequest()
            acceptedRequest.idSender = req.body.idSender
            acceptedRequest.idReceiver = req.body.idReceiver
            acceptedRequest.idRequest = req.body.idRequest
            ///
            Record.find()
            .then(function (record) {
                console.log('records: ', record);
                acceptedRequest.listRecord = record
                acceptedRequest.save()
            })
            //
            console.log(request);
            request.status = 'Accepted'
            request
            .save()
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
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
