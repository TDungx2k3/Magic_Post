const accountsRouter = require('./accountsRoute');
const leaderRouter = require('./leaderRoute');


function route(app) {
  app.use('/account', accountsRouter);
  app.use('/leader', leaderRouter)
}

module.exports = route;