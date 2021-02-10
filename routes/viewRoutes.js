const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getHomepage);
router.get('/tour-details/:slug', viewController.getTourDetails);
router.get('/login', viewController.getLoginPage);

module.exports = router;
