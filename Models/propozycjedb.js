const { Schema, model } = require('mongoose');

const propozycja = new Schema({
  authorid: String,
  messageid: String,
  voteyes: Array,
  voteminus: Array,
  voteno: Array,
});
module.exports = model('propozycja', propozycja);
