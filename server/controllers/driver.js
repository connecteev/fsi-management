// load up the driver model
let Driver = require("../model/driver");

// Handle - create driver with data from the client app on POST request
exports.create_driver = function (req, res) {
  // Create a new driver
  Driver.findOne({
      "driver.email": req.body.email
    },
    function (err, driver) {
      if (err) {
        return res.send(err);
      }
      if (driver) {
        return res.send("This email is already taken.");
      } else {
        let driverData = new Driver();
        driverData.driver.name = req.body.name;
        driverData.driver.email = req.body.email;
        driverData.driver.dateOfBirth = req.body.dateOfBirth;
        driverData.driver.address = req.body.address;
        driverData.driver.contactNumber = req.body.contactNumber;
        driverData.driver.ratePerTrip = req.body.ratePerTrip;
        driverData.driver.joinDate = req.body.joinDate;
        driverData.driver.status = req.body.status;
        driverData.driver.createdAt = Date.now();

        driverData
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
            res.status(400).send("unable to save user to database");
          });
      }
    }
  );
};

// get all drivers
exports.get_drivers = function (req, res) {
  Driver.find()
    .sort({
      'admin.registeredAt': -1
    })
    .exec()
    .then(drivers => {
      res.send({
        success: true,
        drivers
      })
    })
}

// Get a single driver by id
exports.get_single_driver = function (req, res) {
  Driver.findById(req.body.id).then(item => {
    if (!item) {
      return res.send("No driver found");
    }
    res.send(item);
  });
};

// Update a single driver details
exports.update_driver = function (req, res) {
  Driver.findById(req.body.id, function (err, doc) {
    if (err)
      return res.send(err)
    if (!doc)
      return res.send({
        message: 'Driver not found.'
      })
    doc.driver.name = req.body.name;
    doc.driver.email = req.body.email;
    doc.driver.dateOfBirth = req.body.dateOfBirth;
    doc.driver.address = req.body.address;
    doc.driver.contactNumber = req.body.contactNumber;
    doc.driver.ratePerTrip = req.body.ratePerTrip;
    doc.driver.joinDate = req.body.joinDate;
    doc.driver.status = req.body.status;
    doc.save()
      .then(item => {
        res.json({
          success: true,
          message: "Driver updated successfully.",
          item
        })
      })
      .catch(err => {
        res.json({
          message: "Unable to update.",
          err
        })
      })
  })
}

// Delete a driver
exports.delete_driver = function (req, res) {
  Driver.findByIdAndRemove(req.body.id).then(doc => {
    if (!doc) {
      return res.send({
        message: 'Driver not found.'
      })
    }
    res.send({
      success: true,
      message: 'Driver deleted successfully'
    })
  })
}
