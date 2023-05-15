const mongoose = require('mongoose');

const kuponyTOTAL = new mongoose.Schema(
  {
    GuildID: String,
    TotalWin: Number,
    TotalLoss: Number,
  },
  { versionKey: false },
);
module.exports = mongoose.model('kuponyTOTAL', kuponyTOTAL);
