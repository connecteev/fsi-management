// models/passengerAssistant.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our driver model
var paSchema = mongoose.Schema({
  pa: {
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
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

//create the model for passenger assistant and expose it to our app
module.exports = mongoose.model('Pa', paSchema);
