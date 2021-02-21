const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourID/reviews', reviewRouter);

router
  .route('/cheapest-5')
  .get(tourController.aliasCheapestTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.preventUnauthorizedAccess,
    authController.restrictAccessTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.preventUnauthorizedAccess,
    authController.restrictAccessTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.processTourImages,
    tourController.updateTour
  )
  .delete(
    authController.preventUnauthorizedAccess,
    authController.restrictAccessTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/tours-within/:range/coordinates/:latlong/metric-unit /:metricUnit')
  .get(tourController.getToursWithinCertainRange);

router
  .route('/tour-distances/:latlong/metric-unit/:metricUnit')
  .get(tourController.getTourDistances);

module.exports = router;
