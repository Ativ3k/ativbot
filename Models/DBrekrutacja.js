const mongoose = require('mongoose');

const rekrutacja = new mongoose.Schema({
  guildId: String,
  messId: String,
  Uid: String,
  Uname: String,
  Uage: String,
  tresc: String,
  yes: Number,
  idk: String,
  no: String,
});

module.exports = mongoose.model('rekrutacja', rekrutacja);
