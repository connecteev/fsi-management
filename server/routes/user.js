const router = require('express').Router();

// Require controller modules.
let user_controller = require('../controllers/user')

// POST request for handling user registration.
router.post("/api/signup", user_controller.user_registration);

// POST request for handling user authentication.
router.post("/api/login", user_controller.user_login);

// get request for getting all user data.
router.get("/api/get-users", user_controller.get_users);

// POST request for handling change password 
router.post("/api/change-password", user_controller.user_changePassword);

// handle user logout
router.get("/api/logout", user_controller.user_logout);


// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get("/api/authenticated-user", user_controller.isLoggedIn, user_controller.is_authenticated_user);

module.exports = router;
