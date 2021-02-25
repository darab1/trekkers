const Review = require('../models/reviewModel');
const controllerFactory = require('../controllers/controllerFactory');

exports.populateTourAndUserFields = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = controllerFactory.getOneController(Review);
exports.getAllReviews = controllerFactory.getAllController(Review);
exports.createReview = controllerFactory.createController(Review);
exports.updateReview = controllerFactory.updateController(Review);
exports.deleteReview = controllerFactory.deleteController(Review);
