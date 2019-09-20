const router = require('express').Router();

// Require controller modules.
let attendance_controller = require('../controllers/attendance')

// POST request for handling user registration.
router.post("/api/create-attendance", attendance_controller.create_attendance);

// GET request for fetching all attendances from DB
router.get("/api/get-attendances", attendance_controller.get_attendances);

// Get request to find a single attendance
router.post("/api/get-single-attendance", attendance_controller.get_single_attendance);

// POST request to update a attendance details
router.post("/api/update-attendance", attendance_controller.update_attendance);

// Delete a attendance
router.post("/api/delete-attendance", attendance_controller.delete_attendance)

module.exports = router;
