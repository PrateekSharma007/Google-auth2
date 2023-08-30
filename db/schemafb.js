const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fbid: {
    type: String,
    required: true,
    unique: true,
  },

});

const User = mongoose.model('Userfb', userSchema);

module.exports = User;
