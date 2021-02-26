const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utilities/appError');
const globalErrorController = require('./controllers/errorController');

// Require the user routers

const app = express();

//Set PUG VIEW ENGINE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set HTTP security response headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit the number of requests from the same IP
const limiter = rateLimit({
  max: 500, // maximum requests that can be made from a cerain IP
  windowMs: 60 * 60 * 1000, // 1 hour is the window in which you can do these requests
  message: 'You made to many requests from this IP, please try again in an hour' // error message if you exceed this maximum number of requests in an hour
});

app.use('/api', limiter);

// Extract the entire body portion of an incoming request stream and expose it on req.body
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// Sanitize user-supplied data to prevent MongoDB Operaton Injection
app.use(mongoSanitize());

// Sanitize user input coming from POST body, GET queries, and url params
app.use(xss());

// Protect against HTTP Parameter Pollution attacks
app.use(hpp({ whitelist: ['duration', 'price', 'difficulty'] }));

// compress text and json before sending them as a response to the user
app.use(compression());

/********/
// ROUTES
/********/

//Define what routes you will be using and their respective route handlers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Middleware for handling unhandled routes, instead of the html message shown in Postman
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

//This middleware will execute only when there is an error
app.use(globalErrorController);

module.exports = app;
