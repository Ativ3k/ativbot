const mongoose = require('mongoose');

const settings = new mongoose.Schema(
  {
    GuildId: String,
    GuildPremiumTime: Number,
    Debug: String,
    ecoVC: String,
    ecoVCmoney: Number,
    ecoVCxp: Number,
    ecoMEM: String,
    ecoMEMmoney: Number,
    ecoMEMxp: Number,
    ecoMSG: String,
    ecoMSGmoney: Number,
    ecoMSGxp: Number,
    ecoMSGdelay: Number,
    VoiceLog: String,
    VoiceLogChannel: String,
  },
  { versionKey: false },
);

module.exports = mongoose.model('guild_settings', settings);
