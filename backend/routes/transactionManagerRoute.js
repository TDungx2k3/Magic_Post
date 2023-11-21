const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManagerController');

router.get("/testGetMaxTransactionId", transactionManagerController.getMaxTransId);
router.get("/test-get-order-sent", transactionManagerController.showAllOrderSent)
router.post("/createccount", transactionManagerController.createAccountEmployee);

module.exports = router;
