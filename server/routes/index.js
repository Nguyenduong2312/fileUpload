const registerRouter = require('./register');
const loginRouter = require('./login');
const uploadRecordRoute = require('./uploadRecord');
const requestRecord = require('./requestRecord');

//const sessionRouter = require('./session');
//const meRouter = require('./me');

function route(app) {
    app.use('/register', registerRouter);
    app.use('/login', loginRouter);
    app.use('/uploadRecord', uploadRecordRoute);
    app.use('/requestRecord', requestRecord);

    //app.use('/session', sessionRouter);
    //app.use('/me', meRouter);
}

module.exports = route;
