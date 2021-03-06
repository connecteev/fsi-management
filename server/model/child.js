// models/child.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our child model
var childSchema = mongoose.Schema({
  child: {
    email: String,
    name: String,
    dateOfBirth: String,
    address: {
      streetAddress: String,
      country: String,
      town: String,
      postalCode: String,
    },
    parentsNumber: String,
    contactNumber: String,
    landline: String,
    medicalHistory: String,
    schoolName: String,
    schoolAddress: String,
    homePickUpTime: String,
    schoolPickUpTime: String,
    paPickUpTimeAm: String,
    paPickUpTimePm: String,
    routeNumber: String,
    carSeat: String,
    seatingPosition: String,
    music: String,
    joinDate: String,
    leaveDate: String,
    status: String,
    travelDays: [],
    assignedDriver: {
      driverName: String,
      driverId: String
    },
    assignedPa: {
      paName: String,
      paId: String
    },
    paRequired: String,
    createdAt: {
      type: Date,
    },
  }

});

//create the model for childs and expose it to our app
module.exports = mongoose.model('Child', childSchema);
