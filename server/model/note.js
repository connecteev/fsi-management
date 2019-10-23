// models/passengerAssistant.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our driver model
var noteSchema = mongoose.Schema({
  note: {
    noteName: String,
    noteDetails: String,
    userId: String,
    createdAt: Date
  }

});

//create the model for note and expose it to our app
module.exports = mongoose.model('Note', noteSchema);
