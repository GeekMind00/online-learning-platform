const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter user name']
  },
  email: {
    type: String,
    required: [true, 'Please enter user email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide user phone number']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['Student', 'Admin', 'Moderator'],
    default: 'Student'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 4,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  grade: {
    type: String,
    enum: ['First', 'Second', '']
  },
  center: {
    type: String
  },
  sessionDate: {
    type: String
  },
  files: [
    {
      type: {
        type: String,
        enum: ['exams', 'assignments']
      },
      category: {
        type: String
      },
      branch: {
        type: String,
        enum: ['algebra', 'calculus', 'geometry', 'mechanics']
      },
      score: {
        type: Number,
        validate: {
          validator: function (el) {
            return el >= 0;
          },
          message: 'The score value is not valid'
        }
      },
      maxScore: {
        type: Number,
        validate: {
          validator: function (el) {
            return el >= this.score;
          },
          message: 'The score value is not valid'
        }
      },
      path: {
        type: String
      }
    }
  ],
  comment: {
    type: String
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,


  __v: {
    type: Number,
    select: false
  }

});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});



userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
