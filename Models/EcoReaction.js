const mongoose = require('mongoose');

const ecoreaction = new mongoose.Schema({
  channelid: String,
  messid: Array,
});

module.exports = mongoose.model('ecoactivities', ecoreaction);
