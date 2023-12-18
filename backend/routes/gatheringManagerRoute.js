const express = require('express');

const router = express.Router();

const gatheringManagerController = require('../controllers/gatheringManagerController');

router.get("/get-all-employee", gatheringManagerController.showAllEmployee);
router.get("/get-employee-by-id", gatheringManagerController.getDefaultAccountById);
router.post("/delete-account-by-id", gatheringManagerController.deleteAccountEmployee);
router.post("/update-account-by-id", gatheringManagerController.updateAccountEmployee);
router.get("/all-orders-sent", gatheringManagerController.showAllOrdersSent);
router.get("/all-orders-received", gatheringManagerController.showAllOrdersReceived);
router.get("/get-max-date-gather", gatheringManagerController.getMaxDate);
router.get("/get-quantity-orders-sent-in-a-date", gatheringManagerController.countOrderSentInADate);
router.get("/get-quantity-orders-received-in-a-date", gatheringManagerController.countOrderReceivedInADate);

module.exports = router;