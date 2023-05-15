const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  userID: String,
  messageIDreply: String,
  interactionName: String,
});

module.exports = mongoose.model('replycontext', Schema);
