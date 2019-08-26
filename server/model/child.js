// models/child.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our child model
var childSchema = mongoose.Schema({
  child: {
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    name: String,
    dateOfBirth: String,
    address: {
      streetAddress: String,
      country: String,
      town: String,
      postalCode: String,
    },
    contactNumber: String,
    landline: String,
    medicalHistory: String,
    schoolName: String,
    schoolAddress: String,
    homePickUpTime: String,
    schoolPickUpTime: String,
    routeNumber: String,
    joinDate: String,
    leaveDate: String,
    status: String,
    createdAt: {
      type: Date,
    },
  }

});

//create the model for childs and expose it to our app
module.exports = mongoose.model('Child', childSchema);
