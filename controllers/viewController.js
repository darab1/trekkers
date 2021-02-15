const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');
const AppError = require('../utilities/appError');

exports.getHomepage = catchAsyncErrors(async (req, res) => {
  // 1)Get first 3 tours & first 3 users who are guides or lead-guides.
  const tours = await Tour.find().limit(3);
  const guides = await User.find({
    role: { $in: ['lead-guide', 'guide'] }
  }).limit(3);

  res.status(200).render('home', {
    title: 'Homepage',
    tours,
    guides
  });
});

exports.getTourDetails = catchAsyncErrors(async (req, res, next) => {
  // 1) Get the requested tour
  const tour = await Tour.findOne({ slug: req.params.slug });

  if (!tour) {
    return next(
      new AppError(`Sorry, we can't find the tour you're looking for.`, 404)
    );
  }

  res.status(200).render('tour-details', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    title: 'Login Page'
  });
};
