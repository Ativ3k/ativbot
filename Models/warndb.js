const mongoose = require('mongoose');

const warndb = new mongoose.Schema(
  {
    GuildID: String,
    MemberID: String,
    Reason: String,
    ModID: String,
    Time: Number,
    Timeleft: Number,
    Punkty: Number,
  },
  { versionKey: false },
);

module.exports = mongoose.model('warndb', warndb);
