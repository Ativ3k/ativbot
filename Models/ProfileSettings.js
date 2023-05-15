const mongoose = require('mongoose');

const wwProfiles = new mongoose.Schema(
  {
    Guildid: String,
    Memberid: String,
    profile1name: String,
    profile1description: String,
    profile1avatar: String,
    profile1background: String,
  },
  { versionKey: false },
);

module.exports = mongoose.model('wwProfiles', wwProfiles);
