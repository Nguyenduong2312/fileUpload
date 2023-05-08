const Request = require('../models/Request');
const AcceptedRequest = require('../models/AcceptedRequest');

class AcceptedRecordController{

    getRecord(req,res){
        console.log('av');
        console.log('idrequest: ', req.params.id);
        AcceptedRequest.findOne({idRequest: req.params.id})
        .then(function(acceptedRequest){
            res.json(acceptedRequest)
        })
    }
}

module.exports = new AcceptedRecordController();
