const catchAsyncErrors = require("./../utilities/catchAsyncErrors");
const AppError = require("./../utilities/appError");
const QueryOptions = require("../utilities/queryOptions");

exports.createController = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: "Success!",
      data: {
        data: document
      }
    });
  });

exports.getOneController = (Model, populateOptions) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    if (!document) {
      next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "Success!",
      data: {
        data: document
      }
    });
  });

exports.getAllController = Model =>
  catchAsyncErrors(async (req, res, next) => {
    //These two lines are added for gettings ALL reviews on a SINGLE tour resource
    let queryFilter = {};
    if (req.params.tourID) queryFilter = { tour: req.params.tourID };

    const features = new QueryOptions(Model.find(queryFilter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: "Success!",
      results: document.length,
      data: {
        data: document
      }
    });
  });

exports.updateController = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns the modified document rather than the original
      runValidators: true // update validators validate the update operation against the model's schema
    });

    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "Success!",
      data: {
        data: document
      }
    });
  });

exports.deleteController = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "Success",
      data: null
    });
  });
