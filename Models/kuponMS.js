const mongoose = require('mongoose');

const kuponyMS = new mongoose.Schema(
  {
    GuildID: String,
    MemberID: String,
    TypKuponu: String,
    KtoWygra: String,
    IloscGoli: Number,
  },
  { versionKey: false },
);

module.exports = mongoose.model('kuponyMS', kuponyMS);
