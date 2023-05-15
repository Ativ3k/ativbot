const mongoose = require('mongoose');

const settings = new mongoose.Schema(
  {
    GroupServerID: String,
    GroupMemberID: String,
    GroupNameMember: String,
    GroupJoinedAt: Number,
    GroupLeavedAt: Number,
    GroupDonatedCoins: Number,
    GroupDonatedCoinsLogs: Array,
  },
  { versionKey: false },
);

module.exports = mongoose.model('groups', settings);
