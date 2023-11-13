const express = require("express");

const router = express.Router();

const leaderController = require('../controllers/leaderController');

router.get("/showAllGathers", leaderController.showAllGathers);
router.post("/test-create", leaderController.createGather)

module.exports = router;
