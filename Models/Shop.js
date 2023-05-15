const mongoose = require('mongoose');

const shop = new mongoose.Schema(
  {
    Guildid: String,
    item1name: String,
    item1price: Number,
    item2name: String,
    item2price: Number,
    item3name: String,
    item3price: Number,
    item4name: String,
    item4price: Number,
    item5name: String,
    item5price: Number,
    item6name: String,
    item6price: Number,
    item7name: String,
    item7price: Number,
    item8name: String,
    item8price: Number,
    item9name: String,
    item9price: Number,
  },
  { versionKey: false },
);

module.exports = mongoose.model('shop', shop);
