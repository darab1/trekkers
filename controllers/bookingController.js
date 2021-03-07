const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
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
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour-details/${tour.slug}`
  });

  res.status(200).json({
    status: 'success',
    session
  });

  next();
});

const createBookingWithWebhooks = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Booking.create({ price, user, tour });
};

exports.createCheckoutWithWebhooks = (req, res, next) => {
  const stripeSignature = req.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      req.body,
      stripeSignature,
      process.env.STRIPE_WEBHOOKS_SIGNING_SECRET
    );
  } catch (e) {
    return res
      .status(400)
      .send(
        `There was an error with creating a booking with stripe webhooks: ${e.message}`
      );
  }

  if (stripeEvent.type === 'checkout.session.completed')
    createBookingWithWebhooks(stripeEvent.data.object);

  res.status(200).json({ status: 'success', received: true });
};
