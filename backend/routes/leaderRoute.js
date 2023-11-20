const express = require("express");

const router = express.Router();

const leaderController = require('../controllers/leaderController');
const { route } = require("./accountsRoute");

router.get("/showAllGathers", leaderController.showAllGathers);
router.get("/getAllTransactionsWithGatherId", leaderController.showAllTrans);
router.post("/test-create", leaderController.createGather);
router.get("/getGatherInfo", leaderController.getGatherInfoWithID);
router.post("/updateGather", leaderController.updateGather);
router.post("/updateManager", leaderController.updateManager);
router.post("/updateManagerPassword", leaderController.updateManagerPassword)

module.exports = router;
