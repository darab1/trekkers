const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');

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

exports.getTourDetails = (req, res) => {
  res.status(200).render('tour-details', {
    title: 'Olympus Trekking'
  });
};
