const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManagerController');

router.get("/testGetMaxTransactionId", transactionManagerController.getMaxTransId);
router.post("/createAccount", transactionManagerController.createAccountEmployee);
router.get("/get-order-sent", transactionManagerController.showAllOrderSent);
router.get("/get-order-received", transactionManagerController.showAllOrderReceived);
router.get("/get-max-date", transactionManagerController.getMaxDateSent);
router.get("/count-order-sent-by-date", transactionManagerController.countOrderSentInADate);
router.get("/count-order-received-by-date", transactionManagerController.countOrderReceivedInADate);

module.exports = router;
