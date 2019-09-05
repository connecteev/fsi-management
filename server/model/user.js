// models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


// define the schema for our user model
var userSchema = mongoose.Schema({
  local: {
    admin: {
      email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
      },
      password: String,
      name: String,
      username: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
      },
      profilePicture: String,
      registeredAt: {
        type: Date,
      },
      resetPassword: String,
      resetPasswordExpires: Date
    },
    manager: {
      email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
      },
      password: String,
      name: String,
      username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
      },
      profilePicture: String,
      registeredAt: {
        type: Date,
      },
      roles: String,
      resetPassword: String,
      resetPasswordExpires: Date
    },

  }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.admin.password || this.local.manager.password);
};

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  var user;
  if (this.local.admin == '{}' && this.local.customer == '{}') {
    user = this.local.manager;
  } else {
    user = this.local.admin;
  }

  if (user.isModified('password') || this.local.admin.isNew || this.local.manager.isNew) {
    if (this.local.isModified('password')) {
      console.log('is modifed')
    }
    bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  } else {
    return next();
  }

});

//create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
