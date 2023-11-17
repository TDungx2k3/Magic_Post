const express = require("express");

const router = express.Router();

const accountController = require('../controllers/accountsController');

router.get("/showAllAccounts", accountController.showAllAccounts);
router.get("/countAccountByPhoneNumber", accountController.countAccountByPhoneNumber);
router.post('/login', accountController.showAccountByPhoneAndPassword);

module.exports = router;
