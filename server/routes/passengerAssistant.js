const router = require('express').Router();

// Require controller modules.
let pa_controller = require('../controllers/passengerAssistant')

// POST request for handling user registration.
router.post("/api/create-pa", pa_controller.create_pa);

// GET request for fetching all pas from DB
router.get("/api/get-all-pa", pa_controller.get_all_pa);

// Get request to find a single pa
router.post("/api/get-single-pa", pa_controller.get_single_pa);

// POST request to update a pa details
router.post("/api/update-pa", pa_controller.update_pa);

// Delete a pa
router.post("/api/delete-pa", pa_controller.delete_pa)

module.exports = router;
