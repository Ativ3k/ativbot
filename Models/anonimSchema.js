const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  guildId: String,
  adminchannelid: String,
  anonwebhook: String,
  anonimchannel: String,
});

module.exports = mongoose.model('anonim', Schema);
