const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  price: {
    type: Number,
    require: [true, 'A booking must have a price']
  },
  issuedAt: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A booking must be made by a user']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A booking must refer to a tour']
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name difficulty durationInDays'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
