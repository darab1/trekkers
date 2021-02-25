const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsyncErrors = require('../utilities/catchAsyncErrors');
const controllerFactory = require('../controllers/controllerFactory');
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

exports.uploadUserPhoto = upload.single('photo');

exports.processUserPhoto = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) return next();

  // when we save our photo as a buffer the filename property isn't defined, so we define it here in order to be able to use it in the updateMyAccountData
  req.file.filename = `${req.user.fullName
    .split(' ')
    .join('-')
    .toLowerCase()}-${req.user.id.slice(-5)}-${Date.now()}-trekkers.jpeg`;

  await sharp(req.file.buffer)
    .resize(450, 450)
    .sharpen()
    .toFormat('jpeg')
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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

  // 2) Filter all the properties that the user cannot update
  const filteredBodyObject = filterBodyObj(req.body, 'fullName', 'email');
  if (req.file) filteredBodyObject.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filteredBodyObject,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'User account data have been updated',
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
