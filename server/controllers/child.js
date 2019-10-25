// load up the child model
let Child = require("../model/child");

// Handle - create child with data from the client app on POST request
exports.create_child = function (req, res) {
  // Create a new child
  Child.findOne({
      "child.email": req.body.email
    },
    function (err, child) {
      if (err) {
        return res.send(err);
      }
      if (child) {
        return res.send("This email is already taken.");
      } else {
        let childData = new Child();
        childData.child.name = req.body.name;
        childData.child.email = req.body.email;
        childData.child.dateOfBirth = req.body.dateOfBirth;
        childData.child.address = req.body.address;
        childData.child.contactNumber = req.body.contactNumber;
        childData.child.parentsNumber = req.body.parentsNumber;
        childData.child.landline = req.body.landline;
        childData.child.medicalHistory = req.body.medicalHistory;
        childData.child.schoolName = req.body.schoolName;
        childData.child.schoolAddress = req.body.schoolAddress;
        childData.child.homePickUpTime = req.body.homePickUpTime;
        childData.child.schoolPickUpTime = req.body.schoolPickUpTime;
        childData.child.travelDays = req.body.travelDays;
        childData.child.routeNumber = req.body.routeNumber;
        childData.child.carSeat = req.body.carSeat;
        childData.child.seatingPosition = req.body.seatingPosition;
        childData.child.music = req.body.music;
        childData.child.joinDate = req.body.joinDate;
        childData.child.assignedDriver = req.body.assignedDriver;
        childData.child.paRequired = req.body.paRequired;
        childData.child.status = req.body.status;
        childData.child.createdAt = Date.now();

        childData
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

// get all child
exports.get_all_child = function (req, res) {
  Child.find()
    .sort('-child.createdAt')
    .exec()
    .then(childs => {
      res.send({
        success: true,
        childs
      })
    })
}

// Get a single child by id
exports.get_single_child = function (req, res) {
  Child.findById(req.body.id)
    .then(child => {
      if (!child) {
        return res.send("No child found");
      }
      res.send(child);
    });
};

// Update a single child details
exports.update_child = function (req, res) {
  Child.findById(req.body.id, function (err, doc) {
    if (err)
      return res.send(err)
    if (!doc)
      return res.send({
        message: 'child not found.'
      })
    doc.child.name = req.body.name;
    doc.child.email = req.body.email;
    doc.child.dateOfBirth = req.body.dateOfBirth;
    doc.child.address = req.body.address;
    doc.child.contactNumber = req.body.contactNumber;
    doc.child.parentsNumber = req.body.parentsNumber;
    doc.child.landline = req.body.landline;
    doc.child.medicalHistory = req.body.medicalHistory;
    doc.child.schoolName = req.body.schoolName;
    doc.child.schoolAddress = req.body.schoolAddress;
    doc.child.homePickUpTime = req.body.homePickUpTime;
    doc.child.schoolPickUpTime = req.body.schoolPickUpTime;
    doc.child.travelDays = req.body.travelDays;
    doc.child.routeNumber = req.body.routeNumber;
    doc.child.seatingPosition = req.body.seatingPosition;
    doc.child.carSeat = req.body.carSeat;
    doc.child.music = req.body.music;
    doc.child.joinDate = req.body.joinDate;
    doc.child.leaveDate = req.body.leaveDate;
    doc.child.assignedDriver = req.body.assignedDriver;
    doc.child.paRequired = req.body.paRequired;
    doc.child.status = req.body.status;
    doc.save()
      .then(item => {
        res.json({
          success: true,
          message: "child updated successfully.",
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

// Delete a child
exports.delete_child = function (req, res) {
  Child.findByIdAndRemove(req.body.id).then(doc => {
    if (!doc) {
      return res.send({
        message: 'child not found.'
      })
    }
    res.send({
      success: true,
      message: 'child deleted successfully'
    })
  })
}
