const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utilities/catchAsyncErrors');
const controllerFactory = require('./../controllers/controllerFactory');
const AppError = require('../utilities/appError');

const filterBodyObj = function(bodyObj, ...allowedFields) {
  const filteredObj = {};

  Object.keys(bodyObj).forEach(key => {
    if (allowedFields.includes(key)) filteredObj[key] = bodyObj[key];
  });

  return filteredObj;
};

exports.getMyAccountData = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//****************** */
// UPDATE MY ACCOUNT DATA
//****************** */
exports.updateMyAccountData = catchAsyncErrors(async (req, res, next) => {
  // 1) Check if user is trying to change his password and passwordConfirm
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "You can't change your password from here. Please choose the password form.",
        400
      )
    );
  }
  console.log(req.user);
  // 2) Filter all the properties that the user cannot update
  const filteredBodyObject = filterBodyObj(req.body, 'fullName', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filteredBodyObject,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'User account has been updated',
    user: updatedUser
  });
});

//****************** */
// DELETE MY ACCOUNT
//****************** */

exports.deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'Success',
    message: 'Account successfully deleted!',
    data: null
  });
});

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: 'Error!',
    message: 'This route is not yet defined'
  });
};

exports.getUser = controllerFactory.getOneController(User);
exports.getAllUsers = controllerFactory.getAllController(User);
exports.updateUser = controllerFactory.updateController(User);
exports.deleteUser = controllerFactory.deleteController(User);
