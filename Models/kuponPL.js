const mongoose = require('mongoose');

const kuponyPL = new mongoose.Schema(
  {
    GuildID: String,
    MemberID: String,
    TypKuponu: String,
    MiejsceKoncowe: String,
    IloscGoli: Number,
    NajlepszyStrzelec: String,
  },
  { versionKey: false },
);
module.exports = mongoose.model('kuponyPL', kuponyPL);
