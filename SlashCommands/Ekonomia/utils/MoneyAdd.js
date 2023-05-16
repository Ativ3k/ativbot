const chalk = require('chalk');
const database = require('../../../Models/Eco');
const Logger = require('../../../utils/logger');
const { EcoRegisterLog, EcoLog } = require('./MoneyLog');

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
  const user = await database.findOne({ Guildid: settings.GuildId, Memberid: member.user.id });

  const monthsInServer = (Date.now() - member.joinedTimestamp) / 2_629_700_000;
  const boostingServer = (Date.now() - member.premiumSinceTimestamp) / 2_629_700_000;
  let multipler = 1;
  multipler += monthsInServer * 0.01;
  multipler += member.guild.premiumSubscriptionCount * 0.01;
  if (member.premiumSinceTimestamp) multipler += boostingServer * 0.01 + 0.05;
  const moneyAmount = settings.ecoVCmoney / (60 / interval);
  const totalMoney = moneyAmount * multipler;

  await user.updateOne({
    Lastvoicestatus: Date.now(),
    $inc: { Money: totalMoney, Voicecount: interval / 3600 },
  });
}

async function EcoTextAdd(settings, member) {
  const user = await database.findOne({ Guildid: settings.GuildId, Memberid: member.user.id });

  const monthsInServer = (Date.now() - member.joinedTimestamp) / 2_629_700_000;
  const boostingServer = (Date.now() - member.premiumSinceTimestamp) / 2_629_700_000;
  let multipler = 1;
  multipler += monthsInServer * 0.01;
  multipler += member.guild.premiumSubscriptionCount * 0.01;
  if (member.premiumSinceTimestamp) multipler += boostingServer * 0.01 + 0.05;
  console.log(multipler);
  const moneyAmount = settings.ecoMSGmoney;
  await user.updateOne({
    Lastmessagetime: Date.now(),
    $inc: { Money: moneyAmount, Messagescount: 1 },
  });

  const updateData = await database.findOne({ Guildid: settings.GuildId, Memberid: member.user.id });
  EcoLog(member, moneyAmount * multipler, updateData.Money, 'Wiadomość');
  if (settings.Debug === '1') {
    Logger.log(
      chalk.green(`Wpływ na konto: ${moneyAmount * multipler.toFixed(2)}`) + chalk.blue(` | ${member.user.tag}`),
      'eco',
    );
  }
}

module.exports = { EcoVoiceAdd, EcoRegister, EcoTextAdd };
