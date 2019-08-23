const passport = require("passport");
const _ = require("lodash");
let transporterOptions = require('../middlewares/mailTranspoter');
// load up the user model
let User = require('../model/user');
let bcrypt = require('bcrypt');


// Handle user registration with data from the client app on POST request 
exports.user_registration = function (req, res) {
  // Create a new user
  User.findOne({
    $or: [{
      'local.admin.email': req.body.email
    }, {
      'local.admin.username': req.body.username
    }]
  }, function (err, user) {
    if (err) {
      return res.send(err);
    }
    if (user) {
      if (user.local.admin.email == req.body.email) {
        return res.send("This email is taken.")
      }
      return res.send("This username is taken.")

    } else {
      let userData = new User();
      let genStr = (+new Date).toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const saltRounds = 10;
      let hash = bcrypt.hashSync(genStr, saltRounds);
      let updateHash = hash.replace(/[/]/g, '').replace(/[$]/g, '').replace(/[.]/g, '');
      userData.local.admin.name = req.body.name;
      userData.local.admin.email = req.body.email;
      userData.local.admin.username = req.body.username;
      userData.local.admin.password = req.body.password;
      if (req.body.image != undefined || req.body.image == 'null') {
        userData.local.admin.profilePicture = 'uploads/noImageAvailable.jpg';
      } else {
        //userData.local.admin.profilePicture = req.file.path;
        console.log("Upload file method is currently off now.")
      }
      userData.local.admin.verifyEmail = updateHash;
      userData.local.admin.registered = Date.now();
      userData.local.admin.isVerified = true;
      userData.save()
        .then(item => {

          res.send({
            success: true,
            message: 'User saved to DataBase.'
          })
          // `req.user` contains the authenticated user.
          //res.redirect('/profile/' + req.body.username);
        })
        .catch(err => {
          console.log(err);
          res.status(400).send("unable to save user to database");
        })
    }
  })
}


exports.get_users = function (req, res) {
  User.find()
    .sort({
      'admin.registeredAt': -1
    })
    .exec()
    .then(users => {
      res.send({
        success: true,
        users
      })
    })
}


// Handle to get data for a charge filtered by the charge's id
exports.user_login = function (req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({
        success: false,
        message: info.message
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({
        success: true,
        message: 'Login successfull',
        user
      });
    });
  })(req, res, next);
}

// Handle user logout 
exports.user_logout = function (req, res) {
  req.logout();
  res.send({
    logedOut: true,
    success: true
  });
}

// Handle user change password
exports.user_changePassword = function (req, res) {
  User.findById(req.body.id, function (err, item) {
    const isNotAdmin = _.result(item.local, 'admin') == '{}';
    const isNotManager = _.result(item.local, 'manager') == '{}';
    if (err)
      return res.send(err)
    if (item.validPassword(req.body.currentPassword)) {

      if (isNotManager) {
        item.local.admin.password = req.body.newPassword;

        let hash = bcrypt.hashSync(item.local.admin.password, 12);
        item.local.admin.password = hash;
      }
      if (isNotAdmin) {
        item.local.manager.password = req.body.newPassword;

        let hash = bcrypt.hashSync(item.local.manager.password, 12);
        item.local.manager.password = hash;
      }

      item.save(function (err) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            success: true,
            message: "Password Changed succussfully."
          })
        }

      });
    } else {
      res.send({
        success: false,
        message: "Incorrect current password."
      })
    }
  })
}


// Sent user a reset password link for reset their password
exports.user_forgotPassword = function (req, res) {
  User.findOne({
    $or: [{
        $or: [{
          'local.admin.email': req.body.findUser
        }]
      },
      {
        $or: [{
          'local.manager.email': req.body.findUser
        }]
      }
    ]
  }, function (err, user) {
    if (err) {
      return res.send(err);
    }
    if (user) {
      var genStr = (+new Date).toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const saltRounds = 10;
      let hash = bcrypt.hashSync(genStr, saltRounds);
      let updateHash = hash.replace(/[/]/g, '').replace(/[$]/g, '').replace(/[.]/g, '');
      let mailOptions;
      const link = 'http://localhost:3000/reset-password/' + updateHash;
      const message = "Reset your password"

      if (user.local.admin) {
        mailOptions = transporterOptions.sentRestPassMail(user.local.admin.email, link, message);
        user.local.admin.resetPassword = updateHash;
        user.local.admin.resetPasswordExpires = Date.now() + 172800000; // 48 hours
      } else {
        mailOptions = transporterOptions.sentRestPassMail(user.local.manager.email, link, message);
        user.local.manager.resetPassword = updateHash;
        user.local.manager.resetPasswordExpires = Date.now() + 172800000; // 48 hours
      }
      user.save(function () {
        if (err) {
          console.log(err)
        } else {
          res.send({
            success: true,
            message: 'Please check your mail to reset your password.'
          })
        }
      });
      transporterOptions.transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
        else
          res.send({
            success: true,
            message: 'reset pass token link sent user email.'
          })
      });


    } else {
      res.send('Email does not exist!!!');
    }
  });
}

// Verify reset passwort token and reset new password
exports.user_resetPassword = function (req, res) {
  User.findOne({
    $or: [{
        $and: [{
            'local.admin.resetPassword': req.body.resetToken
          },
          {
            'local.admin.resetPasswordExpires': {
              $gt: Date.now()
            }
          }
        ]
      },
      {
        $and: [{
            'local.manager.resetPassword': req.body.resetToken
          },
          {
            'local.manager.resetPasswordExpires': {
              $gt: Date.now()
            }
          }
        ]
      }
    ]
  }, function (err, result) {
    if (err) {
      return res.send(err);
    }
    if (!result) {
      return res.json({
        success: false,
        message: "Password reset token is invalid or has expired."
      });
    }
    if (!req.body.newPassword) {
      return res.send({
        resetToken: true
      })
    }
    const saltRounds = 10;
    if (result.local.admin) {
      result.local.admin.password = req.body.newPassword;
      result.local.admin.resetPassword = undefined;
      result.local.admin.resetPasswordExpires = undefined;

      let hash = bcrypt.hashSync(result.local.admin.password, saltRounds);
      result.local.admin.password = hash;
    } else {
      result.local.manager.password = req.body.newPassword;
      result.local.manager.resetPassword = undefined;
      result.local.manager.resetPasswordExpires = undefined;

      let hash = bcrypt.hashSync(result.local.manager.password, saltRounds);
      result.local.manager.password = hash;
    }
    result.save(function (err) {
      if (err) {
        console.log(err)
      } else {

        res.send({
          resetPassword: true
        })
      }

    });
  });
}



// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
exports.is_authenticated_user = function (req, res, next) {
  res.json({
    id: req.user._id,
    user: req.user.local.admin,
  });
}



// route middleware to make sure
exports.isLoggedIn = function (req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.send('/');
}
