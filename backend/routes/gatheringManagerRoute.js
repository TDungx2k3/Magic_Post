const express = require('express');

const router = express.Router();

const gatheringManagerController = require('../controllers/gatheringManagerController');

router.get("/get-all-employee", gatheringManagerController.showAllEmployee);
router.post("/delete-account-by-id", gatheringManagerController.deleteAccountEmployee);

module.exports = router;