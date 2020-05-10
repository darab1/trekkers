// Import the tour model
const Tour = require("./../models/tourModel");
const catchAsyncErrors = require("./../utilities/catchAsyncErrors");
const AppError = require("./../utilities/appError");
const controllerFactory = require("./../controllers/controllerFactory");

exports.aliasCheapestTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price";
  req.query.fields =
    "fullName, price, difficulty, maxGroupSize, durationInDays, startDates";
  next();
};

exports.getTour = controllerFactory.getOneController(Tour, { path: "reviews" });
exports.getAllTours = controllerFactory.getAllController(Tour);
exports.createTour = controllerFactory.createController(Tour);
exports.updateTour = controllerFactory.updateController(Tour);
exports.deleteTour = controllerFactory.deleteController(Tour);

exports.getToursWithinCertainRange = catchAsyncErrors(
  async (req, res, next) => {
    const { range, latlong, metricUnit } = req.params;
    const [latitude, longitude] = latlong.split(",");

    const sphereRadius = metricUnit === "mi" ? range / 3963.2 : range / 6378.1;

    if (!latitude || !longitude) {
      return next(
        new AppError(
          "Please provide the correct latitude and longitude values for the coordinates",
          400
        )
      );
    }

    const tours = await Tour.find({
      locationOfDeparture: {
        $geoWithin: { $centerSphere: [[longitude, latitude], sphereRadius] }
      }
    });

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        data: tours
      }
    });
  }
);

exports.getTourDistances = catchAsyncErrors(async (req, res, next) => {
  const { latlong, metricUnit } = req.params;
  const [latitude, longitude] = latlong.split(",");

  const metricUnitPrefix = metricUnit === "mi" ? 0.000621371192 : 0.001;

  if (!latitude || !longitude) {
    return next(
      new AppError(
        "Please provide the correct latitude and longitude values for the coordinates",
        400
      )
    );
  }

  const tourDistances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: "calculatedDistance",
        distanceMultiplier: metricUnitPrefix
      }
    },
    {
      $project: {
        name: 1,
        calculatedDistance: 1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: tourDistances
    }
  });
});
