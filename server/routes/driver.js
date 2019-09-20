const router = require('express').Router();

// Require controller modules.
let driver_controller = require('../controllers/driver')

// POST request for handling user registration.
router.post("/api/create-driver", driver_controller.create_driver);

// GET request for fetching all drivers from DB
router.get("/api/get-drivers", driver_controller.get_drivers);

// Get request to find a single driver
router.post("/api/get-single-driver", driver_controller.get_single_driver);

// POST request to update a driver details
router.post("/api/update-driver", driver_controller.update_driver);

// Delete a driver
router.post("/api/delete-driver", driver_controller.delete_driver)

module.exports = router;
