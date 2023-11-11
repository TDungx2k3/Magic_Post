const accountsRouter = require('./accountsRoute');


function route(app) {
  app.use('/account', accountsRouter);
}

module.exports = route;