const mongoose = require('mongoose');

const Gierki = new mongoose.Schema(
  {
    GuildID: String,
    MessID: String,
  },
  { versionKey: false },
);
module.exports = mongoose.model('Gierki', Gierki);
