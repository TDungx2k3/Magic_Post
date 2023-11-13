const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManager');

router.get("/testGetMaxTransactionId", transactionManagerController.getMaxTransId);
// router.post("/createccount", transactionManagerController.createTransactionEmployeeAccount);

module.exports = router;
