const database = require('../../../Models/Eco');
const { EcoRegisterLog } = require('./MoneyLog');

async function EcoRegister(settings, member) {
  await new database({
    Guildid: settings.GuildId,
    Memberid: member.id,
    Membertag: member.user.tag,
    Money: 1,
    Lastmessagetime: Date.now(),
    Messagescount: 0,
    GoodMemeCount: 0,
    Lastvoicestatus: Date.now(),
    Voicecount: 0,
    XPupvote: 0,
    Upvotegettime: 0,
    Upvotecooldown: 0,
  }).save();
  EcoRegisterLog(member);
}

async function EcoVoiceAdd(settings, member, interval) {
  const user = await database.findOne({ Guildid: settings.GuildId, Memberid: member.id });
  const moneyAmount = settings.ecoVCmoney / (60 / interval);
  await user.updateOne({
    Lastvoicestatus: Date.now(),
    $inc: { Money: moneyAmount, Voicecount: interval / 3600 },
  });
}

async function EcoTextAdd(settings, member) {
  const user = await database.findOne({ Guildid: settings.GuildId, Memberid: member.id });
  const moneyAmount = settings.ecoMSGmoney;
  await user.updateOne({
    Lastmessagetime: Date.now(),
    $inc: { Money: moneyAmount, Messagescount: 1 },
  });
}

module.exports = { EcoVoiceAdd, EcoRegister };
