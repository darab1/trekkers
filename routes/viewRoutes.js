const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewController.getHomepage);
router.get(
  '/tour-details/:slug',
  authController.preventUnauthorizedAccess,
  viewController.getTourDetails
);
router.get('/login', viewController.getLoginPage);

module.exports = router;
