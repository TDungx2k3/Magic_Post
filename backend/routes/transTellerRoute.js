const express = require("express");

const router = express.Router();

const transactionTellerController = require('../controllers/transTellerController');

router.get("/getToCustomerOrder", transactionTellerController.getAllToCustomerOrder);
router.get("/getFromCustomerOrder", transactionTellerController.getAllFromCustomerOrder);
router.get("/getPathStart", transactionTellerController.getPathStart);
router.get("/getPathEnd", transactionTellerController.getPathEnd);
router.post("/createOrder", transactionTellerController.createOrder);

module.exports = router;
