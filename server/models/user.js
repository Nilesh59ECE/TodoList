const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  birthday: Date,
  address: String,
  googleId: String,
  tasks: [{
    task: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
