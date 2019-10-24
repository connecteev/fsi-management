// models/passengerAssistant.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our driver model
var fileUploadSchema = mongoose.Schema({
  document: {
    userId: String,
    userName: String,
    documentName: String,
    expiryDate: String,
    redAlertDate: String,
    greenAlertDate: String,
    documentPath: String,
    documentPublicId: String,
    status: String,
    createdAt: Date
  }

});

//create the model for FileUpload and expose it to our app
module.exports = mongoose.model('FileUpload', fileUploadSchema);
