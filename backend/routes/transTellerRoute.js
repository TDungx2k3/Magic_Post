const express = require("express");

const router = express.Router();

const transactionTellerController = require('../controllers/transTellerController');

router.get("/getToCustomerOrder", transactionTellerController.getAllToCustomerOrder);
router.get("/getFromCustomerOrder", transactionTellerController.getAllFromCustomerOrder);
router.post("/createDeliveryStep1", transactionTellerController.transToGatherStep1);
router.post("/transToCustomerStep7", transactionTellerController.transToCustomerStep7);
router.post("/confirmSuccessStep5", transactionTellerController.confirmSuccessStep5);
router.post("/customerAccept", transactionTellerController.customerAccept);
router.get("/getPathStart", transactionTellerController.getPathStart);
router.get("/getPathEnd", transactionTellerController.getPathEnd);
router.post("/createOrder", transactionTellerController.createOrder);
router.post("/createOrderStep6", transactionTellerController.createOrderInTran);
router.get("/getTransactionById", transactionTellerController.getTransactionById);
router.get("/getOrderById", transactionTellerController.getOrderById);
router.get("/getDeliveryByOrderId", transactionTellerController.getAllDeliveryByOrderId);

router.get("/showAllGathers", transactionTellerController.showAllGathers);
router.get("/showAllTransactionsByGather", transactionTellerController.showAllTransactionsByGather);

router.get("/getTransNameById", transactionTellerController.getTransNameById);
router.get("/getGatherNameById", transactionTellerController.getGatherNameById);

router.post("/lostOrder", transactionTellerController.lostOrder);
router.post("/customerDeny", transactionTellerController.customerDeny);

router.get("/getMaxDelivery", transactionTellerController.getMaxDelivery);

module.exports = router;
