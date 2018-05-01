const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});
userSchema.path("email").validate(email => {
  return validator.isEmail(email);
}, 'Not a valid email');

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  var { email, _id } = userObject;
  return { email, _id }
}

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
})

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
  user.tokens.push({ access, token })
  return user.save().then(() => token)
}

userSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: { token }
    }
  })
}

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return Promise.reject(error)
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

userSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject()
        }
      })
    })
  })
}

var User = mongoose.model("User", userSchema);

module.exports = {
  User
}