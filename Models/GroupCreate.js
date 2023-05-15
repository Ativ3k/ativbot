const mongoose = require('mongoose');

const settings = new mongoose.Schema(
  {
    GroupServerID: String,
    GroupName: String,
    GroupCreatedAt: Number,
    GroupOwner: String,
    GroupMembers: Array,
    GroupCoins: Number,
    GroupCoinsLogs: Array,
  },
  { versionKey: false },
);

module.exports = mongoose.model('groups_members', settings);
