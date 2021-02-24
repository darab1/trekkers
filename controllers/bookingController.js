const stripe = require('stripe')(
  'sk_test_51I3kB2CCmdQckf5rZLnbPYez5aH6B9GuE0uGkqUxdpky6rSGnzGV97zaD4ZFvTD3yeOU8mT9ohaE2Sdb2vwBq4x700MXHU83UC'
);
const Tour = require('../models/tourModel');
const controllerFactory = require('../controllers/controllerFactory');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');

exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);
  console.log(tour);
  // CREATE STRIPE CHECKOUT SESSION
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: `${tour.name}`,
        description: tour.summary,
        amount: tour.price * 100,
        currency: 'eur',
        quantity: 1
      }
    ],
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour-details/${tour.slug}`
  });

  console.log(session);

  res.status(200).json({
    status: 'success',
    session
  });

  next();
});
