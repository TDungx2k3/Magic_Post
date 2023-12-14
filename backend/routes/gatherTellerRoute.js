const express = require("express");

const router = express.Router();

const gatherTellerController = require('../controllers/gatherTellerController');

router.get("/getToTransactionOrder", gatherTellerController.getAllToTransactionOrder);
router.get("/getFromTransactionOrder", gatherTellerController.getAllFromTransactionOrder);


module.exports = router;
