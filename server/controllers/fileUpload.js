// load up the file upload model
let FileUpload = require("../model/fileUpload");
const cloudinary = require("cloudinary").v2;
let moment = require('moment');




// Handle - add document  from the client app on POST request
exports.add_document = function (req, res) {

  let fileData = new FileUpload();
  fileData.document.documentName = req.body.documentName;
  fileData.document.userId = req.body.userId;
  fileData.document.userName = req.body.userName;
  fileData.document.expiryDate = req.body.expiryDate;
  fileData.document.redAlertDate = req.body.redAlertDate;
  fileData.document.greenAlertDate = req.body.greenAlertDate;
  fileData.document.documentPath = req.file.url;
  fileData.document.documentPublicId = req.file.public_id;
  fileData.document.status = req.body.status;
  fileData.document.createdAt = Date.now();

  fileData
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
};
// get single user all documents
exports.get_user_document = function (req, res) {
  FileUpload.find({
      'document.userId': req.body.userId
    })
    .sort('-document.createdAt')
    .exec()
    .then(documents => {
      if (!documents) {
        return res.send("No documents found")
      }
      res.send({
        success: true,
        documents
      })
    })
}
// Get a single document by id
exports.get_single_document = function (req, res) {
  FileUpload.findById(req.body.id)
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

// Handle - update document - Post Request
exports.update_document = function (req, res) {
  FileUpload.findById(req.body.id, function (err, doc) {
    if (err)
      return res.send(err)
    if (!doc)
      return res.send({
        message: 'Document not found.'
      })
    doc.document.documentName = req.body.documentName;
    doc.document.userId = req.body.userId;
    doc.document.userName = req.body.userName;
    doc.document.expiryDate = req.body.expiryDate;
    doc.document.redAlertDate = req.body.redAlertDate;
    doc.document.greenAlertDate = req.body.greenAlertDate;
    if (req.body.file != null) {
      console.log("File not found", req.body.file);
    } else {
      cloudinary.uploader.destroy(doc.document.documentPublicId);
      doc.document.documentPath = req.file.url;
      doc.document.documentPublicId = req.file.public_id;
    }
    doc.document.status = req.body.status;
    doc.save()
      .then(item => {
        res.json({
          success: true,
          message: "Document updated successfully.",
          item
        })
      })
      .catch(err => {
        res.json({
          message: "Unable to update document.",
          err
        })
      })
  })
}

// get user expire document - Post Request 
exports.get_expire_documents = function(req, res){
  FileUpload.find({
    'document.expiryDate':{ 
           "$gte": moment().format("YYYY-MM-DD"), 
           "$lt": moment().add(3, 'months').format("YYYY-MM-DD")
        }
  })
  .sort({'document.expiryDate': 1 })
  .exec()
  .then(documents => {
    if (!documents) {
      return res.send("No documents found")
    }
    res.send({
      success: true,
      documents
    })
  })
}
// Delete a document
exports.delete_document = function (req, res) {
  FileUpload.findByIdAndRemove(req.body.id).then(doc => {
    if (!doc) {
      return res.send({
        message: 'Document not found.'
      })
    }

    cloudinary.uploader.destroy(doc.document.documentPublicId);
    res.send({
      success: true,
      message: 'Document deleted successfully'
    })
  })
}
