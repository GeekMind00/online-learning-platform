const crypto = require('crypto');
const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const { Session } = require('inspector');
// const { stringify } = require('querystring');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter user\'\s name']
  },
  email: {
    type: String,
    required: [true, 'Please enter user email'],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, 'Please provide a valid email']
  },
  phoneNumber:{
    type: String,
    required: [true,'Please provide your phone number']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'moderator'],
    default: 'student'
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
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  // passwordChangedAt: Date,
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  // active: {
  //   type: Boolean,
  //   default: true,
  //   select: false
  // },
  grade: {
    type: String,
    enum: ['First', 'Second'],
    // required: [true,'Please provide your current grade']
  },
  center: {
      type: String,
      // required: [true, 'Please provide your sessions center']
  },
  sessionDate: {
    type: String,
    // required: [true, 'Please provide your session date'],
  },
  exams:[
    {
      category:{
      type: String,
      required: true
      },
      branch:{
      type: String,
      enum: ['Algebra', 'Calculas', 'Geometry','Mechanics'],
      required: true
      },
      score:{
          type: Number,
          required: true
      },
      maxScore:{
          type: Number,
          required: true
      }
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;