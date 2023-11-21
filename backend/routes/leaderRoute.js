const express = require("express");

const router = express.Router();

const leaderController = require('../controllers/leaderController');
const { route } = require("./accountsRoute");

router.get("/showAllGathers", leaderController.showAllGathers);
router.get("/getAllTransactionsWithGatherId", leaderController.showAllTrans);
router.get("/getGatherInfo", leaderController.getGatherInfoWithID);
router.post("/updateGather", leaderController.updateGather);
router.post("/updateManager", leaderController.updateManager);
router.post("/updateManagerPassword", leaderController.updateManagerPassword);

router.get("/getTransactionInfo", leaderController.getTransactionInfoWithID);
router.post("/updateTransaction", leaderController.updateTransaction);
router.post("/createGather", leaderController.createGather);
router.post("/createGatherManager", leaderController.createGatherManager);
router.get("/getCntPhone", leaderController.countPhoneNumber);
router.get("/getNewestId", leaderController.getNewestId);
router.get("/getMaxGatherId", leaderController.getMaxGatherId);
router.post("/updateAccountInGather", leaderController.updateAccountInGather);


module.exports = router;
