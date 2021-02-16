const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.userLoginStatus, viewController.getHomepage);
router.get(
  '/tour-details/:slug',
  authController.userLoginStatus,
  viewController.getTourDetails
);
router.get(
  '/login',
  authController.userLoginStatus,
  viewController.getLoginPage
);
router.get(
  '/user-account',
  authController.preventUnauthorizedAccess,
  viewController.getUserAccount
);
module.exports = router;
