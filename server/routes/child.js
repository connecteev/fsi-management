const router = require('express').Router();

// Require controller modules.
let child_controller = require('../controllers/child')

// POST request for handling user registration.
router.post("/api/create-child", child_controller.create_child);

// GET request for fetching all child from DB
router.get("/api/get-all-child", child_controller.get_all_child);

// Get request to find a single child
router.post("/api/get-single-child", child_controller.get_single_child);

// POST request to update a child details
router.post("/api/update-child", child_controller.update_child);

// Delete a child
router.post("/api/delete-child", child_controller.delete_child)

module.exports = router;
