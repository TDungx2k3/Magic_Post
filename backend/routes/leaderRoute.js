const express = require("express");

const router = express.Router();

const leaderController = require('../controllers/leaderController');

router.get("/showAllGathers", leaderController.showAllGathers);

module.exports = router;
