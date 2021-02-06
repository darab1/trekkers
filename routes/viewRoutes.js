const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getHomepage);

router.get('/tour-details/:slug', viewController.getTourDetails);

module.exports = router;
