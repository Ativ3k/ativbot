const mongoose = require('mongoose');

const VoiceTemp = new mongoose.Schema(
  {
    GuildID: String,
    GeneratorID: String,
    OwnerID: String,
    VCid: String,
    TXTid: String,
  },
  { versionKey: false },
);
module.exports = mongoose.model('VoiceTemp', VoiceTemp);
