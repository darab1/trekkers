const AppError = require('./../utilities/appError');

// Handle cast errors when trying to get a tour using an invallid path id
const handleCastErrorDB = err => {
  const message = `The value ${err.value} for the ${err.path} path is INVALID`;
  return new AppError(message, 400);
};

// Handle duplicate fields errors when creating a new tour
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `An field with the value of ${value} already exists. Please use another value.`;
  return new AppError(message, 400);
};

// Handle validation errors when updating tours
const handleValidationError = err => {
  const errorMessages = Object.values(err.errors).map(el => el.message);
  const message = `${errorMessages.join(', ')}`;
  return new AppError(message, 400);
};

// Handle corrupted JWT error
const handleJWTError = () => {
  return new AppError(
    'Corrupted json web token found, please log in again',
    401
  );
};

// Handle JWT expired error
const handleJWTExpiredError = () => {
  return new AppError(
    'Your json web token has expired, please log in again!',
    401
  );
};

// DEVELOPMENT ERRORS
// send API development errors
const sendDevError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// render development error pages
const renderDevErrorPage = (err, req, res) => {
  console.error('PROGRAMMING ERROR', err);

  res.status(err.statusCode).render('error', {
    statusCode: err.statusCode,
    message: err.message
  });
};

// PRODUCTION ERRORS
// send API production errors
const sendProdError = (err, req, res) => {
  //An operational error, it's ok to send some details to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    //An uknown programming error, like a bug, we don't want to show the details to the client
  } else {
    console.error('PROGRAMMING ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong...'
    });
  }
};

// render production error pages
const renderProdErrorPage = (err, req, res) => {
  //An operational error, it's ok to send some details to the client
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      statusCode: err.statusCode,
      message: err.message
    });
    //An uknown programming error, like a bug, we don't want to show the details to the client
  } else {
    console.error('PROGRAMMING ERROR', err);

    res.status(err.statusCode).render('error', {
      status: 'error',
      statusCode: err.statusCode,
      message: 'Something went wrong, please try again later.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //DEVELOPMENT ENVIRONMENT
  if (process.env.NODE_ENV === 'development') {
    if (req.originalUrl.startsWith('/api')) {
      sendDevError(err, req, res);
    } else {
      renderDevErrorPage(err, req, res);
    }
    //PRODUCTION ENVIRONMENT
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    console.log(`error message : ${error.message}`);
    console.log(`err message : ${err.message}`);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    if (req.originalUrl.startsWith('/api')) {
      sendProdError(error, req, res);
    } else {
      console.log('renderProdErrorPage is about to be called...');
      renderProdErrorPage(error, req, res);
    }
  }
};
