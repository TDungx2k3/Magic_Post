const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManagerController');

router.post("/createAccount", transactionManagerController.createAccountEmployee);
router.get("/get-order-sent", transactionManagerController.showAllOrderSent);
router.get("/get-order-received", transactionManagerController.showAllOrderReceived);
router.get("/get-max-date-sent-transaction", transactionManagerController.getMaxDateSent);
router.get("/get-max-date-received-transaction", transactionManagerController.getMaxDateReceived);
router.get("/count-order-sent-by-date", transactionManagerController.countOrderSentInADate);
router.get("/count-order-received-by-date", transactionManagerController.countOrderReceivedInADate);
router.get("/get-deny-list", transactionManagerController.showDenyList);
router.get("/get-lost-order-list", transactionManagerController.showLostOrderList);

module.exports = router;
