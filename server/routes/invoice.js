const router = require('express').Router();


// Require controller modules.
let invoice_controller = require('../controllers/invoice')

// POST request for handle generate invoices 
router.post("/api/generate-invoice", invoice_controller.generate_invoices);



module.exports = router;
