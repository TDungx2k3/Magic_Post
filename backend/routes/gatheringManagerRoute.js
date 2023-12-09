const express = require('express');

const router = express.Router();

const gatheringManagerController = require('../controllers/gatheringManagerController');

router.get("/get-all-employee", gatheringManagerController.showAllEmployee);
router.get("/get-employee-by-id", gatheringManagerController.getDefaultAccountById);
router.post("/delete-account-by-id", gatheringManagerController.deleteAccountEmployee);
router.post("/update-account-by-id", gatheringManagerController.updateAccountEmployee);

module.exports = router;