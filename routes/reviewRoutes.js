const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.preventUnauthorizedAccess);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictAccessTo('user'),
    reviewController.populateTourAndUserFields,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictAccessTo('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictAccessTo('admin', 'user'),
    reviewController.deleteReview
  );

module.exports = router;
