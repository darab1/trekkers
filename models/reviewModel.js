const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [5, 'A review must have a minimum length of 5 characters'],
      maxlength: [1000, 'A review must have a maximum of 500 characters'],
      required: [true, 'A review must not be empty']
    },
    rating: {
      type: Number,
      min: [1, 'A review rating starts at 1'],
      max: [5, 'A review rating ends at 5'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must be written by a regular user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// INDEXES
//Prevent users from writing multiple reviews for the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//******************** */
// QUERY HOOKS/MIDDLEWARE
//******************** */

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'fullName photo'
  });
  next();
});

// Static method for calculating the avg and sum of ratings for a certain tour when creating/updating/deleting a review
reviewSchema.statics.calcAvgSumOfRatings = async function(tourID) {
  const ratingsAvgSum = await this.aggregate([
    {
      $match: { tour: tourID }
    },
    {
      $group: {
        _id: '$tour',
        numOfRatings: { $sum: 1 },
        avgOfRatings: { $avg: '$rating' }
      }
    }
  ]);

  if (ratingsAvgSum.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      numberOfRatings: ratingsAvgSum[0].numOfRatings,
      averageOfRatings: ratingsAvgSum[0].avgOfRatings
    });
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      numberOfRatings: 0,
      averageOfRatings: 0
    });
  }
};

// Call calcAvgSumOfRatings when creating a new review
reviewSchema.post('save', function() {
  this.constructor.calcAvgSumOfRatings(this.tour);
});

// Call calcAvgSumOfRatings when updating/deleting a review
reviewSchema.post(/^findOneAnd/, function(reviewDoc) {
  console.log(reviewDoc);
  reviewDoc.constructor.calcAvgSumOfRatings(reviewDoc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
