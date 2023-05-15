const mongoose = require('mongoose');

const VoiceGenerator = new mongoose.Schema(
  {
    GuildID: String,
    GeneratorID: String,
    ImmuneRole: String,
  },
  { versionKey: false },
);
module.exports = mongoose.model('VoiceGenerator', VoiceGenerator);
