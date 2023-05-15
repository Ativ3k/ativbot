const mongoose = require('mongoose');

const karaokeschema = new mongoose.Schema({
  guildid: String,
  karaokeID: String,
  userid: String,
  messid: String,
  vote1: Array,
  vote2: Array,
  vote3: Array,
  vote4: Array,
  vote5: Array,
  total: Number,
});

module.exports = mongoose.model('karaoke', karaokeschema);
