const registerRouter = require('./register');
const loginRouter = require('./login');
const sessionRouter = require('./session');
//const meRouter = require('./me');

function route(app) {
    app.use('/register', registerRouter);
    app.use('/login', loginRouter);
    app.use('/session', sessionRouter);
    //app.use('/me', meRouter);
}

module.exports = route;
