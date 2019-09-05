// load up the passenger assistant model
let Pa = require("../model/passengerAssistant");

// Handle - create pa with data from the client app on POST request
exports.create_pa = function (req, res) {
  // Create a new pa
  Pa.findOne({
      "pa.email": req.body.email
    },
    function (err, pa) {
      if (err) {
        return res.send(err);
      }
      if (pa) {
        return res.send("This email is already taken.");
      } else {
        let paData = new Pa();
        paData.pa.name = req.body.name;
        paData.pa.email = req.body.email;
        paData.pa.dateOfBirth = req.body.dateOfBirth;
        paData.pa.address = req.body.address;
        paData.pa.contactNumber = req.body.contactNumber;
        paData.pa.ratePerTrip = req.body.ratePerTrip;
        paData.pa.joinDate = req.body.joinDate;
        paData.pa.status = req.body.status;
        paData.pa.createdAt = Date.now();

        paData
          .save()
          .then(item => {
            res.send({
              success: true,
              message: "Saved successfully.",
              item
            });
          })
          .catch(err => {
            console.log(err);
            res.status(400).send("Unable to save Passenger Assistant.");
          });
      }
    }
  );
};

// get all pas
exports.get_all_pa = function (req, res) {
  Pa.find()
    .sort('-pa.createdAt')
    .exec()
    .then(pas => {
      res.send({
        success: true,
        pas
      })
    })
}

// Get a single pa by id
exports.get_single_pa = function (req, res) {
  Pa.findById(req.body.id)
    .then(pa => {
      if (!pa) {
        return res.send("No Passenger Assistant found");
      }
      res.send(pa);
    });
};

// Update a single pa details
exports.update_pa = function (req, res) {
  Pa.findById(req.body.id, function (err, doc) {
    if (err)
      return res.send(err)
    if (!doc)
      return res.send({
        message: 'Passenger Assistant not found.'
      })
    doc.pa.name = req.body.name;
    doc.pa.email = req.body.email;
    doc.pa.dateOfBirth = req.body.dateOfBirth;
    doc.pa.address = req.body.address;
    doc.pa.contactNumber = req.body.contactNumber;
    doc.pa.ratePerTrip = req.body.ratePerTrip;
    doc.pa.joinDate = req.body.joinDate;
    doc.pa.leaveDate = req.body.leaveDate;
    doc.pa.status = req.body.status;
    doc.save()
      .then(item => {
        res.json({
          success: true,
          message: "Passenger Assistant updated successfully.",
          item
        })
      })
      .catch(err => {
        res.json({
          message: "Unable to update Passenger Assistant.",
          err
        })
      })
  })
}

// Delete a pa
exports.delete_pa = function (req, res) {
  Pa.findByIdAndRemove(req.body.id).then(doc => {
    if (!doc) {
      return res.send({
        message: 'Passenger Assistant not found.'
      })
    }
    res.send({
      success: true,
      message: 'Passenger Assistant deleted successfully'
    })
  })
}
