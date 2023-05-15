const mongoose = require('mongoose');

const MECZE = new mongoose.Schema(
  {
    GuildID: String,
    Druzyna1: String,
    Druzyna2: String,
    CzasStartu: Date,
    Winner: String,
    Status: String,
    ifT1win: Number,
    ifDRAW: Number,
    ifT2win: Number,
  },
  { versionKey: false },
);
module.exports = mongoose.model('MECZE', MECZE);
