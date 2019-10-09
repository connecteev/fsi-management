// load up the attendance model
let Attendance = require("../model/attendance");

// Handle - create attendance with data from the client app on POST request
exports.create_attendance = function (req, res) {
  // Create a new attendance
  Attendance.findOne({
      "attendance.driverId": req.body.driverId
    },
    function (err, attendance) {
      if (err) {
        return res.send(err);
      }
      if (attendance) {
        attendance.attendance.dates.push(req.body.attendanceDate);
        attendance
          .save()
          .then(item => {
            res.json({
              success: true,
              message: "Attendance added successfully.",
              item
            });
          })
          .catch(err => {
            res.json({
              message: "Unable to add attendance.",
              err
            });
          });
      } else {
        let attendanceData = new Attendance();
        attendanceData.attendance.driverId = req.body.driverId;
        attendanceData.attendance.dates.push(req.body.attendanceDate);
        attendanceData.attendance.createdAt = Date.now();
        attendanceData
          .save()
          .then(item => {
            res.send({
              success: true,
              message: "Attendance added successfully.",
              item
            });
          })
          .catch(err => {
            res.status(400).send({
              message: "unable to save user to database",
              err
            });
          });
      }
    }
  );
};

// Handle - create alternative shits with data from the client app on POST request
exports.create_alternative_shifts = function (req, res) {
  // Create a new attendance
  Attendance.findOne({
      "attendance.driverId": req.body.driverId
    },
    function (err, attendance) {
      if (err) {
        return res.send(err);
      }
      if (attendance) {
        attendance.attendance.alternativeShifts.push(req.body.alternativeShifts);
        attendance
          .save()
          .then(item => {
            res.json({
              success: true,
              message: "Attendance added successfully.",
              item
            });
          })
          .catch(err => {
            res.json({
              message: "Unable to add attendance.",
              err
            });
          });
      }
      // else {
      //   let attendanceData = new Attendance();
      //   attendanceData.attendance.driverId = req.body.driverId;
      //   attendanceData.attendance.dates.push(req.body.attendanceDate);
      //   attendanceData.attendance.createdAt = Date.now();
      //   attendanceData
      //     .save()
      //     .then(item => {
      //       res.send({
      //         success: true,
      //         message: "Attendance added successfully.",
      //         item
      //       });
      //     })
      //     .catch(err => {
      //       res.status(400).send({
      //         message: "unable to save user to database",
      //         err
      //       });
      //     });
      // }
    }
  );
};

// get all attendances
exports.get_attendances = function (req, res) {
  Attendance.find()
    .sort("-attendance.createdAt")
    .exec()
    .then(attendances => {
      res.send({
        success: true,
        attendances
      });
    });
};

// Get a single driver attendance by driverId
exports.get_driver_attendance = function (req, res) {
  Attendance.findOne({
    "attendance.driverId": req.body.driverId
  }).then(attendance => {
    if (!attendance) {
      return res.send("No attendance found");
    }
    res.send(attendance);
  });
};

// Ger current date attendance by date

exports.get_todays_attendance = function (req, res) {
  Attendance.find({
    "attendance.dates.date": req.body.currentDate
  }).then(
    attendance => {
      if (!attendance) {
        return res.send("No attendance found");
      }
      res.send(attendance);
    }
  );
};

// Update a single attendance details
exports.update_attendance = function (req, res) {
  attendance.findById(req.body.id, function (err, doc) {
    if (err) return res.send(err);
    if (!doc)
      return res.send({
        message: "attendance not found."
      });
    doc.attendance.name = req.body.name;
    doc.attendance.email = req.body.email;
    doc.attendance.dateOfBirth = req.body.dateOfBirth;
    doc.attendance.address = req.body.address;
    doc.attendance.contactNumber = req.body.contactNumber;
    doc.attendance.ratePerTrip = req.body.ratePerTrip;
    doc.attendance.joinDate = req.body.joinDate;
    doc.attendance.leaveDate = req.body.leaveDate;
    doc.attendance.status = req.body.status;
    doc
      .save()
      .then(item => {
        res.json({
          success: true,
          message: "attendance updated successfully.",
          item
        });
      })
      .catch(err => {
        res.json({
          message: "Unable to update.",
          err
        });
      });
  });
};

// Delete a attendance
exports.delete_attendance = function (req, res) {
  Attendance.findByIdAndRemove(req.body.id).then(doc => {
    if (!doc) {
      return res.send({
        message: "attendance not found."
      });
    }
    res.send({
      success: true,
      message: "attendance deleted successfully"
    });
  });
};

// Delete all attendance
exports.delete_all_attendance = function (req, res) {
  Attendance.remove({})
};
