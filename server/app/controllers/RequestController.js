const Request = require('../models/Request');


class RequestController{
    getRequest(req,res) {
        Request.find().then(function(rc){
            res.status(200).json(rc)
        })
    }
    request(req,res){
        const idReceiver = req.body.id;
        const request = new Request()
        request.idReceiver = idReceiver
        request.idSender = '142'
        console.log(request);
        request.save()
        .then(() => res.json({status: true}))
        .catch(()  => res.json({status: false}))
    }
}

module.exports = new RequestController();
