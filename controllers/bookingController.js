const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factoryController = require('./factoryController');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');

// BASIC CRUD FUNCTIONALITIES
exports.createBooking = factoryController.createController(Booking);
exports.getBooking = factoryController.getOneController(Booking);
exports.getAllBookings = factoryController.getAllController(Booking);
exports.updateBooking = factoryController.updateController(Booking);
exports.deleteBooking = factoryController.deleteController(Booking);

exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  // CREATE STRIPE CHECKOUT SESSION
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: `${tour.name}`,
        description: tour.summary,
        amount: tour.price * 100,
        currency: 'eur',
        // images: [`${tour.coverImage}`],
        images: [
          `${req.protocol}://${req.get(
            'host'
          )}/img/tours/${tour.name.toLowerCase()}/${tour.coverImage}`
        ],
        quantity: 1
      }
    ],
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    success_url: `${req.protocol}://${req.get('host')}/?price=${
      tour.price
    }&user=${req.user.id}&tour=${req.params.tourId}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour-details/${tour.slug}`
  });

  console.log(`sessionObject: ${session}`);
  console.log(
    `coverImage: ${req.protocol}://${req.get(
      'host'
    )}/img/tours/${tour.name.toLowerCase()}/${tour.coverImage}`
  );

  res.status(200).json({
    status: 'success',
    session
  });

  next();
});

exports.createBookingWithCheckout = catchAsyncErrors(async (req, res, next) => {
  const { price, user, tour } = req.query;

  if (!price && !user && !tour) return next();
  await Booking.create({ price, user, tour });

  res.redirect(`${req.protocol}://${req.get('host')}/`);
});
