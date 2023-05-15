const mongoose = require('mongoose');

const kuponyMECZE = new mongoose.Schema(
  {
    GuildID: String,
    MemberID: String,
    MemberTAG: String,
    idmeczu: String,
    MessID: String,
    Winner: String,
    BetValue: Number,
    Time: Number,
    Druzyna1: String,
    Druzyna2: String,
    Status: String,
    Confirmed: Boolean,
    Multipler: Number,
  },
  { versionKey: false },
);

module.exports = mongoose.model('kuponyMECZE', kuponyMECZE);
