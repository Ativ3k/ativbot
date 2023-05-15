const mongoose = require('mongoose');

const ecoVC = new mongoose.Schema({
  guildid: String,
  memberid: String,
  lastvoicestatus: Number,
});

module.exports = mongoose.model('ecovc', ecoVC);
