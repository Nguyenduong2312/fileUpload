const Request = require('../models/Request');


class RequestController{
    getRequest(req, res) {
        Request.find().then(function (request) {
            res.status(200).json(request);
        });
    }
    getRequestByReceiverId(req,res) {
        Request.find({idReceiver: '1', status: 'Waitting'})
        .then(function(request){
            res.status(200).json(request)
        })
    }
    getRequestBySenderId(req,res) {
        Request.find({idSender: '142', status: 'Waitting'})
        .then(function(request){
            res.status(200).json(request)
        })
    }
    request(req,res){
        const idReceiver = req.body.id;
        const request = new Request()
        request.idReceiver = idReceiver
        request.idSender = '142'
        request.save()
        .then(() => res.json({status: true}))
        .catch(()  => res.json({status: false}))
    }
    updateRequest(req,res){
        Request.findOne({_id: req.params.id})
        .then((request) => {
            request.status = 'accepted'
            request
            .save()
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
        })
    }
    deleteRequest(req,res){
        console.log();
        Request.findOneAndRemove({_id: req.params.id})
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }));
}
}

module.exports = new RequestController();
