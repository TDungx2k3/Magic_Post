const accountsRouter = require('./accountsRoute');
const leaderRouter = require('./leaderRoute');
const transactionManager = require('./transactionManagerRoute');
const gatheringManager = require("./gatheringManagerRoute");

function route(app) {
  app.use('/account', accountsRouter);
  app.use('/leader', leaderRouter);
  app.use('/transaction-manager', transactionManager);
  app.use("/gathering-manager", gatheringManager);
}

module.exports = route;