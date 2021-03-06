const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log(`Error name: ${err.name}, Error message: ${err.message}`);
  console.log('Uncaught Exception Error, shutting down the app...');

  process.exit(1);
});

// Read the environment variables from config.env
dotenv.config({ path: './config.env' });

const app = require('./app');

//Create a DB constant which contains the connection string to your database
const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to the database using mongoose, remember this returns a promise so do sth with that, object contains options in order to deal with deprecation warnings

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connection with trekkers DB was succesful'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Trekkers is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(`Error name: ${err.name}, Error message: ${err.message}`);
  console.log('Unhandled Rejection Error, shutting down the app...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log(
    'SIGTERM Signal Emitted! Shuting down the server after all the pending requests have been handled...'
  );
  server.close(() => {
    console.log('Server shut down!');
  });
});
