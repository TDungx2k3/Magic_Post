const express = require("express");

const router = express.Router();

const gatherTellerController = require('../controllers/gatherTellerController');

router.get("/getToTransactionOrder", gatherTellerController.getAllToTransactionOrder);
router.get("/getFromTransactionOrder", gatherTellerController.getAllFromTransactionOrder);
router.post("/confirmSuccessStep1", gatherTellerController.confirmSuccessStep1);
router.post("/confirmSuccessStep3", gatherTellerController.confirmSuccessStep3);
router.post("/createDeliveryStep3", gatherTellerController.gatherToGatherStep3);
router.post("/createDeliveryStep5", gatherTellerController.gatherToTransStep5);
router.post("/lostOrder", gatherTellerController.lostOrder);
router.post("/customerDeny", gatherTellerController.customerDeny);


module.exports = router;
