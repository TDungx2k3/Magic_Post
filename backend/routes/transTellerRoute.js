const express = require("express");

const router = express.Router();

const transactionTellerController = require('../controllers/transTellerController');

router.get("/getToCustomerOrder", transactionTellerController.getAllToCustomerOrder);
router.get("/getFromCustomerOrder", transactionTellerController.getAllFromCustomerOrder);

module.exports = router;
