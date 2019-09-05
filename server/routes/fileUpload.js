const router = require('express').Router();

// load up the file upload methods
const uploadDocument = require('../middlewares/fileUploaderMulter');

// Require controller modules.
let file_upload_controller = require('../controllers//fileUpload')

// POST request for handling user registration.
router.post("/api/add-document", uploadDocument.uploadFile.single('file'), file_upload_controller.add_document);

// GET request for fetching user documents from DB
router.post("/api/get-user-document", file_upload_controller.get_user_document);

// Get request to find a single document
router.post("/api/get-single-document", file_upload_controller.get_single_document);

// POST request to update a document details
router.post("/api/update-document", uploadDocument.uploadFile.single('file'), file_upload_controller.update_document);

// Delete a document
router.post("/api/delete-document", file_upload_controller.delete_document)

module.exports = router;
