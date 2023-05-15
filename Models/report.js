const mongoose = require('mongoose');

const reportchannel = new mongoose.Schema({
  guildId: String,
  reportchannel: String,
});

module.exports = mongoose.model('reportchannel', reportchannel);
