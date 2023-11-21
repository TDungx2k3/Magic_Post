const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManagerController');

router.get("/testGetMaxTransactionId", transactionManagerController.getMaxTransId);
router.get("/testGetOrderSent", transactionManagerController.showAllOrderSent)
router.post("/createccount", transactionManagerController.createAccountEmployee);

module.exports = router;
