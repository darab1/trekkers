const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'lead-guide', 'guide'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This keyword only works on create and save!!!
      validator: function(value) {
        return value === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetTokenDB: String,
  passwordResetTokenExpiresAt: Date,
  photo: {
    type: String,
    default: 'default.png'
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

//************************
// PRE HOOKS/MIDDLEWARE
//************************

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Add passwordChangedAt property to the new user document (this runs just before the document is saved in the DB)
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query object
  this.find({ active: true });
  next();
});

//************************
// INSTANCE METHODS
//************************

// Compare login password with the password saved in the DB
userSchema.methods.isPasswordCorrect = async function(
  loginPassword,
  userSchemaPassword
) {
  return await bcrypt.compare(loginPassword, userSchemaPassword);
};

//********************************************************************** */
//Check if password was changed after the token was issued
userSchema.methods.isPassChangedAfterIssuedJWT = function(JWTIssuedAt) {
  if (this.passwordChangedAt) {
    const passwordChangedAtTimestamp = parseInt(
      this.passwordChangedAt / 1000,
      10
    );
    return passwordChangedAtTimestamp > JWTIssuedAt;
  }

  return false;
};

// TODO: Change passwordResetToken -> newPasswordResetToken and in the update function also, and this.passwordResetTokenDB -> this.passwordResetToken and change the last one in the userSchema also and in authController.js in passwordResetToken function in the catch block
//********************************************************************** */s
// Generate 2 password reset tokens
userSchema.methods.generatePasswordResetToken = function() {
  const passwordResetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetTokenDB = crypto
    .createHash('sha256')
    .update(passwordResetToken)
    .digest('hex');

  // add 20 minutes to Date.now()
  this.passwordResetTokenExpiresAt = Date.now() + 20 * 60 * 1000;

  return passwordResetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
