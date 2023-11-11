const express = require("express");

const router = express.Router();

const accountController = require('../controllers/accountsController');

router.get("/showAllAccounts", accountController.showAllAccounts);

module.exports = router;
