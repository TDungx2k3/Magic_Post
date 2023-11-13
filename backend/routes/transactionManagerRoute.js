const express = require("express");

const router = express.Router();

const transactionManagerController = require('../controllers/transactionManager');
const transactionManager = require("../controllers/transactionManager");

router.get("/testGetMaxTransactionId", transactionManagerController.getMaxTransId);
router.get("/testGetOrderReceive", transactionManager.showAllOrderReceive)
// router.post("/createccount", transactionManagerController.createTransactionEmployeeAccount);

module.exports = router;
