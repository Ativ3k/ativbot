const mongoose = require('mongoose');

const eco = new mongoose.Schema(
  {
    Guildid: String,
    Memberid: String,
    Membertag: String,
    AvatarUrl: String,
    Money: Number,
    Lastmessagetime: Number,
    Messagescount: Number,
    GoodMemeCount: Number,
    Lastvoicestatus: Number,
    Voicecount: Number,
    XPupvote: Number,
    Upvotegettime: Number,
    Upvotecooldown: Number,
    XPbonus: Number,
    Inventory: Array,
  },
  { versionKey: false },
);

module.exports = mongoose.model('eco', eco);
