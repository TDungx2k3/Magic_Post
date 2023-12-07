const express = require("express");

const router = express.Router();

const transactionTellerController = require('../controllers/transTellerController');

router.get("/getToCustomerOrder", transactionTellerController.getAllToCustomerOrder);
router.get("/getFromCustomerOrder", transactionTellerController.getAllFromCustomerOrder);
router.post("/createDeliveryStep1", transactionTellerController.transToGatherStep1);
router.post("/transToCustomerStep7", transactionTellerController.transToCustomerStep7);
router.post("/confirmSuccessStep5", transactionTellerController.confirmSuccessStep5);
router.post("/customerAccept", transactionTellerController.customerAccept);

module.exports = router;
