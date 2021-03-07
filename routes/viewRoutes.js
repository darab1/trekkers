const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  authController.userLoginStatus,
  // bookingController.createBookingWithCheckout,
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
  '/signup',
  authController.userLoginStatus,
  viewController.getSignupPage
);

router.get(
  '/reset-password',
  authController.userLoginStatus,
  viewController.getResetPasswordPage
);

router.get(
  '/user-account',
  authController.preventUnauthorizedAccess,
  viewController.getUserAccount
);

router.get(
  '/all-tours',
  authController.userLoginStatus,
  viewController.getAllToursPage
);

module.exports = router;
