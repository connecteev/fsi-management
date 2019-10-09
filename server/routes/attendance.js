const router = require('express').Router();

// Require controller modules.
let attendance_controller = require('../controllers/attendance')

// POST request for handling user registration.
router.post("/api/create-attendance", attendance_controller.create_attendance);

// GET request for fetching all attendances from DB
router.get("/api/get-attendances", attendance_controller.get_attendances);

// Get request to find a single driver attendance
router.post("/api/get-driver-attendance", attendance_controller.get_driver_attendance);

// Get request to find today's attendance
router.post("/api/get-todays-attendance", attendance_controller.get_todays_attendance);
// POST request to update a attendance details
router.post("/api/update-attendance", attendance_controller.update_attendance);

// Delete a attendance
router.post("/api/delete-attendance", attendance_controller.delete_attendance)

// Delete all attendance
router.get("/api/delete-all-attendance", attendance_controller.delete_all_attendance)



module.exports = router;
