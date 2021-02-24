const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingWithCheckout,
  authController.userLoginStatus,
  viewController.getHomepage
);
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
