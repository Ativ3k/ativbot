const mongoose = require('mongoose');

const cooldown = new mongoose.Schema({
  userID: String,
  commandName: String,
  cooldown: Number,
});

module.exports = mongoose.model('cooldown', cooldown);
