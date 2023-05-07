const Request = require('../models/Request');
const Record = require('../models/Record');

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
        const idReceiver = req.body.idBN;
        const request = new Request()
        request.idReceiver = idReceiver
        request.idSender = req.params.id
        request.save()
        .then(() => res.json({status: true}))
        .catch(()  => res.json({status: false}))
    }
    updateRequest(req,res){
        Request.findOne({_id: req.params.id})
        .then((request) => {
            request.status = 'Accepted'
            request
            .save()
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
        })
    }
    deleteRequest(req,res){
        Request.findOneAndRemove({_id: req.params.id})
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }));
}
}

module.exports = new RequestController();
