const accountRouter = require('./login');
const uploadRecordRoute = require('./record');
const requestRecord = require('./requestRecord');
const updateAccount = require('./updateAccount');
const membership = require('./membership');

function route(app) {
    app.use('/account', accountRouter);
    app.use('/record', uploadRecordRoute);
    app.use('/requestRecord', requestRecord);
    app.use('/myProfile', updateAccount);
    app.use('/membership', membership);
}

module.exports = route;
