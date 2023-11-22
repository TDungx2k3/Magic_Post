const express = require("express");

const router = express.Router();

const accountController = require('../controllers/accountsController');

router.get("/showAllAccounts", accountController.showAllAccounts);
router.get("/countAccountByPhoneNumber", accountController.countAccountByPhoneNumber);
router.post('/login', accountController.showAccountByPhoneAndPassword);
router.post('/deleteAllAccountInTransaction', accountController.deleteAllAccountInTransaction);
router.post('/deleteTransaction', accountController.deleteTransaction);
router.post("/deleteGather", accountController.deleteGather);
router.post("/deleteAllAccountInGather", accountController.deleteAllAccountInGather);

module.exports = router;
