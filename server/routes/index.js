const registerRouter = require('./register');
const loginRouter = require('./login');
const uploadRecordRoute = require('./record');
const requestRecord = require('./requestRecord');
const updateAccount = require('./updateAccount');
const membership = require('./membership');
const ipfs = require('./ipfs');

function route(app) {
    app.use('/register', registerRouter);
    app.use('/login', loginRouter);
    app.use('/record', uploadRecordRoute);
    app.use('/requestRecord', requestRecord);
    app.use('/myProfile', updateAccount);
    app.use('/membership', membership);
    app.use('/ipfs', ipfs);
}

module.exports = route;
