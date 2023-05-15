const mongoose = require('mongoose');

const InviteTracker = new mongoose.Schema(
  {
    GuildID: String,
    MemberID: String,
    Total: Array,
  },
  { versionKey: false },
);

module.exports = mongoose.model('InviteTracker', InviteTracker);
