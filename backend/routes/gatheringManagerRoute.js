const express = require('express');

const router = express.Router();

const gatheringManagerController = require('../controllers/gatheringManagerController');

router.post('createAccount', gatheringManagerController.createAccountEmployee);
router.get("/get-all-employee", gatheringManagerController.showAllEmployee);

module.exports = router;