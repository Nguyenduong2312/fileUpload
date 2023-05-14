const registerRouter = require('./register');
const loginRouter = require('./login');
const uploadRecordRoute = require('./uploadRecord');
const requestRecord = require('./requestRecord');
const updateAccount = require('./updateAccount');
const acceptedRequest = require('./acceptedRequest');
const membership = require('./membership');

function route(app) {
    app.use('/register', registerRouter);
    app.use('/login', loginRouter);
    app.use('/uploadRecord', uploadRecordRoute);
    app.use('/requestRecord', requestRecord);
    app.use('/myProfile', updateAccount);
    app.use('/acceptedRequest',acceptedRequest);
    app.use('/membership',membership)
}

module.exports = route;
