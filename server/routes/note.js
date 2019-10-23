const router = require('express').Router();

// Require controller modules.
let note_controller = require('../controllers/note');

// POST request for handling user registration.
router.post("/api/add-note", note_controller.add_note);

// GET request for fetching user notes from DB
router.post("/api/get-user-note", note_controller.get_user_note);

// Get request to find a single note
router.post("/api/get-single-note", note_controller.get_single_note);

// POST request to update a note details
router.post("/api/update-note", note_controller.update_note);

// Delete a note
router.post("/api/delete-note", note_controller.delete_note)

module.exports = router;
