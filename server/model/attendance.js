// models/attendance.js
// load the things we need
var mongoose = require("mongoose");

// define the schema for our attendance model
var attendanceSchema = mongoose.Schema({
  attendance: {
    userId: String,
    dates: [],
    alternativeShifts: [],
    createdAt: {
      type: Date
    }
  }
});

//create the model for attendances and expose it to our app
module.exports = mongoose.model("Attendance", attendanceSchema);
