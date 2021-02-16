const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utilities/catchAsyncErrors');
const AppError = require('./../utilities/appError');
const sendEmail = require('./../utilities/email');

// Function for signing the token, it only need one parameter, the id
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Create and send token via cookie
const createThenSendToken = (user, res, statusCode, message) => {
  const jsonWebToken = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // This if ensures that we need to be in an https connection in order to be able to login in production mode
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', jsonWebToken, cookieOptions);

  // Don't show password in the response object
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message: message,
    user: user,
    token: jsonWebToken
  });
};

// *********************
// SIGN UP USER
// *********************
exports.signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createThenSendToken(newUser, res, 201, 'New user signed up');
});

// *********************
// LOGIN USER
// *********************
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please insert your email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password'); // we use + because in the schema, the password field has the option select: false, this is how  we include it in the document user

  // Check if user exists, if he doesn't move forward, if he does call isLoginPasswordCorrect and compare password with  user.password using bcrypt
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(
      new AppError('Email or password was incorrect, please try again!', 401)
    );
  }

  createThenSendToken(user, res, 200, 'User successfully logged in');
});

//*****************
// LOGOUT
//*****************
exports.logout = (req, res) => {
  res.cookie('jwt', 'logging user out...', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

//***************************************
//PROTECT ROUTES FROM UNAUTHORIZED ACCESS
//***************************************

exports.preventUnauthorizedAccess = catchAsyncErrors(async (req, res, next) => {
  // 1) Get the token from body.headers and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Please log  in to get access', 401));
  }

  // 2) Verify token
  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if the user still exists
  const currentUser = await User.findById(decodedPayload.id);

  if (!currentUser) {
    return next(new AppError("We can't find a user with this token", 401));
  }

  // 4) Check if the user changed the password after the token was issued
  if (currentUser.isPassChangedAfterIssuedJWT(decodedPayload.iat)) {
    return next(
      new AppError(
        'Password changed after json web token was issued, please log in again in order to access this route',
        401
      )
    );
  }

  // Save currentUser document to req.user
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Check if user is logged in or not in order to display the correct header navbar
exports.userLoginStatus = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodedPayload = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if the user still exists
      const currentUser = await User.findById(decodedPayload.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if the user changed the password after the token was issued
      if (currentUser.isPassChangedAfterIssuedJWT(decodedPayload.iat)) {
        return next();
      }

      // Save current user document to req.user
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }

  next();
};

exports.restrictAccessTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission for this kind of action', 403)
      );
    }

    next();
  };
};

exports.forgotMyPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user with this email exists.', 404));
  }

  // 2) Generate the random reset token
  const passwordResetToken = user.generatePasswordResetToken();
  user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${passwordResetToken}`;

  const message = `You recently requested to reset your password for your Yeti Tours account. Click the link below to reset it. \n ${resetURL}  \nIf you did not request a password reset, please ignore this email. This password reset is only valid for the next 20 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Request for password reset',
      message
    });

    res.status(200).json({
      status: 'success',
      message: "The reset password token was sent to the client's email"
    });
  } catch (err) {
    user.passwordResetTokenDB = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'We could not send the email, please try a request for a password reset again later',
        500
      )
    );
  }
});

exports.resetMyPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Find user based on the password reset token
  const encryptedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetTokenDB: encryptedToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() }
  });

  // 2) If there is a user with that token create new password
  if (!user) {
    return next(
      new AppError('There is no user associated with that token', 404)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetTokenDB = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  // 3) Run pre hook for modifying passwordChangedAt property in DB

  await user.save();

  // 4) Create jwt and send it to the user
  createThenSendToken(user, res, 201, 'Password reset was succesful');
});

exports.updateMyPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return next(new AppError('There is no user found with that id', 404));
  }
  // 2) Check if POSTed current password is correct
  const isPassCorrect = await user.isPasswordCorrect(
    req.body.currentPassword,
    user.password
  );
  // 3) If so, update password
  if (!isPassCorrect) {
    return next(
      new AppError('Invalid password, please use the correct password', 401)
    );
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmNewPassword;

  await user.save();

  // 4) Log user in, send JWT

  createThenSendToken(user, res, 200, 'Your password was successfully updated');
});
