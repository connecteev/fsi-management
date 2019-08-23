// models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our driver model
var driverSchema = mongoose.Schema({
  driver: {
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
    ratePerTrip: String,
    joinDate: String,
    leaveDate: String,
    status: String,
    createdAt: {
      type: Date,
    },
  }

});

//create the model for drivers and expose it to our app
module.exports = mongoose.model('Driver', driverSchema);
