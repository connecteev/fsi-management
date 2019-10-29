var moment = require("moment");
// Load the full build.
var _ = require("lodash");
// load up the attendance model
let Attendance = require("../model/attendance");

// load up the driver model
let Driver = require("../model/driver");

// Handle - generate monthly invoices
exports.generate_invoices = function (req, res) {
  // generate monthly invoices
  Attendance.findOne({
      "attendance.userId": req.body.userId
    },
    function (err, attendance) {
      if (err) {
        return res.send(err);
      }
      if (attendance) {
        let totalWorkDays = attendance.attendance.dates;
        let totalAlternativeWorks = attendance.attendance.alternativeShifts;
        let totalMonthlyWork = [];
        let totalMonthlyAlternativeWorks = [];
        let startDate = req.body.startDate; //YYYY-MM-DD
        let endDate = req.body.endDate; //YYYY-MM-DD
        let totalShiftsPerMonth = 0;
        let totalAlternativeShiftsPerMonth = 0;
        totalWorkDays.map(item => {
          if (dateCheck(startDate, endDate, item.date)) {
            totalMonthlyWork.push(item);
          }
        });
        totalAlternativeWorks.map(item => {
          if (dateCheck(startDate, endDate, item.alternativeWork.date)) {
            totalMonthlyAlternativeWorks.push(item);
          }
        });
        totalMonthlyWork.map(item => {
          if (item.shifts.morning == true && item.shifts.evening == true) {
            totalShiftsPerMonth += 2;
          } else if (
            item.shifts.morning == true ||
            item.shifts.evening == true
          ) {
            totalShiftsPerMonth += 1;
          }
        });
        totalMonthlyAlternativeWorks.map(item => {
          if (
            item.alternativeWork.shifts.morning == true &&
            item.alternativeWork.shifts.evening == true
          ) {
            totalAlternativeShiftsPerMonth += 2;
          } else if (
            item.alternativeWork.shifts.morning == true ||
            item.alternativeWork.shifts.evening == true
          ) {
            totalAlternativeShiftsPerMonth += 1;
          }
        });

        res.send({
          success: true,
          totalShiftsPerMonth,
          totalMonthlyAlternativeWorks,
          totalMonthlyWork,
          totalAlternativeShiftsPerMonth
        });
      } else {
        res.send({
          message: "No attendance found!"
        });
      }
    }
  );
};



// date check between a range
function dateCheck(from, to, check) {
  var fDate, lDate, cDate;
  fDate = Date.parse(from);
  lDate = Date.parse(to);
  cDate = Date.parse(check);

  if (cDate <= lDate && cDate >= fDate) {
    return true;
  }
  return false;
}
