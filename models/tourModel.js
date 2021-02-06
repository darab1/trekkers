const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'The name of a tour must have equal or less than 100 characters'
      ],
      minlength: [
        5,
        'The name of a tour must have equal or more than 5 characters'
      ]
    },
    durationInDays: {
      type: Number,
      required: [true, 'A tour must have a duration in days']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Acceptable difficulty values: easy, medium, hard'
      }
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size']
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: `Discount price {VALUE} must always be below the tour price`
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    averageOfRatings: {
      type: Number,
      default: 4.0,
      min: [1, 'Ratings must have a value above 1.0'],
      max: [5, 'Ratings must have a value below 5.0'],
      set: value => Math.round(value * 10) / 10
    },
    numberOfRatings: {
      type: Number,
      default: 10
    },
    coverImage: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    startDates: {
      type: [Date],
      required: [true, 'A tour must have one start date or more ']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    guides: [
      {
        // type: mongoose.Schema.ObjectId,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    //Define the Geospatial Data in GeoJSON format
    locationOfDeparture: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      name: String,
      address: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        name: String,
        dayOfTour: Number,
        address: String
      }
    ],
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//INDEXES
tourSchema.index({ price: 1, averageOfRatings: -1 });
tourSchema.index({ locationOfDeparture: '2dsphere' });
// You don't have a slug in your tourSchema
tourSchema.index({ slug: 1 });

// Create a virtual field called reviews on tour document
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// Create a slug for the tour-details page.
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//****************** */
// QUERY MIDDLEWARE
//****************** */

// Pre hooks, for populating the guides and reviews(virtual) fields
tourSchema.pre(/^find/, function(next) {
  this.populate({ path: 'guides', select: '-__v' });
  next();
});

// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'reviews',
//     fields: 'review rating user'
//   });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
