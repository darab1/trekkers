const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/create-checkout-session/:tourId',
  authController.preventUnauthorizedAccess,
  bookingController.createCheckoutSession
);

module.exports = router;
