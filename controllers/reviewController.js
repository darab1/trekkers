const Review = require('../models/reviewModel');
const factoryController = require('./factoryController');

exports.populateTourAndUserFields = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factoryController.getOneController(Review);
exports.getAllReviews = factoryController.getAllController(Review);
exports.createReview = factoryController.createController(Review);
exports.updateReview = factoryController.updateController(Review);
exports.deleteReview = factoryController.deleteController(Review);
