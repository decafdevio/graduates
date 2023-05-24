const mongoose = require('mongoose');

const employerSchema = mongoose.Schema({
  company: String,
  industry: String,
  bio: String,
  linkedin: String,
  portfolio: String,
  email:  String,
  location: String,
  picture: String,
  skills: Array
})

module.exports.Employer = mongoose.model('Employer', employerSchema, 'User')

// var users = mongoose.model('User', loginUserSchema, 'users');
// var registerUser = mongoose.model('Registered', registerUserSchema, 'users');
