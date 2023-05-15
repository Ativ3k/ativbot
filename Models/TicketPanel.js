const mongoose = require('mongoose');

const weryfikacja18 = new mongoose.Schema({
  guildId: String,
  everyone: String,
  staff: String,
  category: String,
});

module.exports = mongoose.model('weryfikacja18', weryfikacja18);
