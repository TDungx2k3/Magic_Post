const accountsRouter = require('./accountsRoute');
const leaderRouter = require('./leaderRoute');
const transactionManager = require('./transactionManagerRoute')

function route(app) {
  app.use('/account', accountsRouter);
  app.use('/leader', leaderRouter)
  app.use('/transaction-manager', transactionManager)
}

module.exports = route;