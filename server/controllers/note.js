// load up the file upload model
let Note = require("../model/note");


// Handle - add note  from the client app on POST request
exports.add_note = function (req, res) {
  let noteData = new Note();
  noteData.note.noteName = req.body.noteName;
  noteData.note.userId = req.body.userId;
  noteData.note.noteDetails = req.body.noteDetails;
  noteData.note.createdAt = Date.now();
  noteData
    .save()
    .then(item => {
      res.send({
        success: true,
        message: "Note added successfully.",
        item
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to save database");
    });
};
// get single user all notes
exports.get_user_note = function (req, res) {
  Note.find({
      'note.userId': req.body.userId
    })
    .sort('-note.createdAt')
    .exec()
    .then(notes => {
      if (!notes) {
        return res.send("No notes found")
      }
      res.send({
        success: true,
        notes
      })
    })
}
// Get a single note by id
exports.get_single_note = function (req, res) {
  Note.findById(req.body.id)
    .then(doc => {
      if (!doc) {
        return res.send("No doc found");
      }
      res.send({
        success: true,
        doc
      });
    });
};

// Handle - update note - Post Request
exports.update_note = function (req, res) {
  Note.findById(req.body.id, function (err, doc) {
    if (err)
      return res.send(err)
    if (!doc)
      return res.send({
        message: 'note not found.'
      })
    doc.note.noteName = req.body.noteName;
    doc.note.noteDetails = req.body.noteDetails;
    doc.note.userId = req.body.userId;
    doc.save()
      .then(item => {
        res.json({
          success: true,
          message: "note updated successfully.",
          item
        })
      })
      .catch(err => {
        res.json({
          message: "Unable to update note.",
          err
        })
      })
  })
}


// Delete a note
exports.delete_note = function (req, res) {
  Note.findByIdAndRemove(req.body.id).then(doc => {
    if (!doc) {
      return res.send({
        message: 'note not found.'
      })
    }
    res.send({
      success: true,
      message: 'note deleted successfully'
    })
  })
}
