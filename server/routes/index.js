const registerRouter = require('./register');
const accountRouter = require('./login');
const recordRoute = require('./record');
const requestRecord = require('./requestRecord');
const updateAccount = require('./updateAccount');
const membership = require('./membership');

function route(app) {
    app.use('/register', registerRouter);
    app.use('/account', accountRouter);
    app.use('/record', recordRoute);
    app.use('/requestRecord', requestRecord);
    app.use('/myProfile', updateAccount);
    app.use('/membership', membership);
}

module.exports = route;
