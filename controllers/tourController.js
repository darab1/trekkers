const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');
const AppError = require('../utilities/appError');
const controllerFactory = require('../controllers/controllerFactory');

exports.aliasCheapestTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price';
  req.query.fields =
    'fullName, price, difficulty, maxGroupSize, durationInDays, startDates';
  next();
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'The file you try to upload is not an image, only images are allowed!',
        400
      ),
      false
    );
  }
};

// Upload user photo using the multer package
const upload = multer({ storage, fileFilter });

exports.uploadTourImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.processTourImages = catchAsyncErrors(async (req, res, next) => {
  console.log(req.files);
  if (!req.files.coverImage && !req.files.images) return next();

  const tour = await Tour.findById(req.params.id);

  //add coverImage property to req.body because in the updateController of controllerFactory.js we use the req.body data to update a document, so we need
  // coverImage in order to update the coverImage field value of our db data.
  req.body.coverImage = `${tour.name
    .split(' ')
    .join('-')
    .toLowerCase()}-${tour.id.slice(-5)}-${Date.now()}-cover.jpeg`;

  // process the coverImage
  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1300)
    .sharpen()
    .toFormat('jpeg')
    .toFile(
      `public/img/tours/${tour.name.toLowerCase()}/${req.body.coverImage}`
    );

  // PROCESS THE IMAGES
  // create an images property inside the body object in order to be able to update the images field in the database later
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `${tour.name
        .split(' ')
        .join('-')
        .toLowerCase()}-${tour.id.slice(-5)}-${Date.now()}-${index + 1}.jpeg`;

      req.body.images.push(filename);

      await sharp(file.buffer)
        .resize(1600, 1200)
        .sharpen()
        .toFormat('jpeg')
        .toFile(`public/img/tours/${tour.name.toLowerCase()}/${filename}`);
    })
  );
  next();
});

exports.getTour = controllerFactory.getOneController(Tour, { path: 'reviews' });
exports.getAllTours = controllerFactory.getAllController(Tour);
exports.createTour = controllerFactory.createController(Tour);
exports.updateTour = controllerFactory.updateController(Tour);
exports.deleteTour = controllerFactory.deleteController(Tour);

exports.getToursWithinCertainRange = catchAsyncErrors(
  async (req, res, next) => {
    const { range, latlong, metricUnit } = req.params;
    const [latitude, longitude] = latlong.split(',');

    const sphereRadius = metricUnit === 'mi' ? range / 3963.2 : range / 6378.1;

    if (!latitude || !longitude) {
      return next(
        new AppError(
          'Please provide the correct latitude and longitude values for the coordinates',
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
      status: 'success',
      results: tours.length,
      data: {
        data: tours
      }
    });
  }
);

exports.getTourDistances = catchAsyncErrors(async (req, res, next) => {
  const { latlong, metricUnit } = req.params;
  const [latitude, longitude] = latlong.split(',');

  const metricUnitPrefix = metricUnit === 'mi' ? 0.000621371192 : 0.001;

  if (!latitude || !longitude) {
    return next(
      new AppError(
        'Please provide the correct latitude and longitude values for the coordinates',
        400
      )
    );
  }

  const tourDistances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: 'calculatedDistance',
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
    status: 'success',
    data: {
      data: tourDistances
    }
  });
});
