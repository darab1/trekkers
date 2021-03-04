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
    title: 'Login'
  });
};

// Pass this function to the locals object along with the signup template
exports.getSignupPage = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup'
  });
};

// RENDER RESET PASSWORD PAGE
exports.getResetPasswordPage = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Your Password'
  });
};

exports.getUserAccount = (req, res) => {
  res.status(200).render('userAccount', {
    title: 'My Account'
  });
};

exports.getAllToursPage = catchAsyncErrors(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('allTours', {
    title: 'All Tours',
    tours
  });
});

exports.getCreateNewPasswordPage = (req, res, next) => {
  console.log(`token: ${req.params.token}`);
  res.status(200).render('createNewPassword', {
    title: 'Create New Password',
    token: req.params.token
  });
};
