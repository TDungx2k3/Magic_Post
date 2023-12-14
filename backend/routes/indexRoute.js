const accountsRouter = require('./accountsRoute');
const leaderRouter = require('./leaderRoute');
const transactionManager = require('./transactionManagerRoute');
const gatheringManager = require("./gatheringManagerRoute");
const transTeller = require('./transTellerRoute');
const gatherTeller = require('./gatherTellerRoute');

function route(app) {
  app.use('/account', accountsRouter);
  app.use('/leader', leaderRouter);
  app.use('/transaction-manager', transactionManager);
  app.use("/gathering-manager", gatheringManager);
  app.use("/transTeller", transTeller);
  app.use("/gatherTeller", gatherTeller);
}

module.exports = route;