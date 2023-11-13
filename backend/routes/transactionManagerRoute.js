const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManagerController');

router.get("/testGetMaxTransactionId", transactionManagerController.getMaxTransId);
// router.post("/createccount", transactionManagerController.createTransactionEmployeeAccount);

module.exports = router;
