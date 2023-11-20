const express = require("express");

const router = express.Router();

const leaderController = require('../controllers/leaderController');

router.get("/showAllGathers", leaderController.showAllGathers);
router.get("/getAllTransactionsWithGatherId", leaderController.showAllTrans);
router.post("/test-create", leaderController.createGather);
router.get("/getGatherInfo", leaderController.getGatherInfoWithID);

module.exports = router;
