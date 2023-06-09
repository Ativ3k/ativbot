const chalk = require('chalk');
const database = require('../../../Models/Eco');
const guildDatabase = require('../../../Models/GuildSettings');
const Logger = require('../../../utils/logger');
const { EcoRegisterLog, EcoLog } = require('./MoneyLog');

async function EcoRegister(server, member) {
  if (!server || !member) throw new Error('Failed - EcoRegister');
  await new database({
    Guildid: server.id,
    Memberid: member.id,
    Membertag: member.user.username,
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

async function EcoVoiceAdd(server, member, serverSettings, interval) {
  if (!server || !member || !serverSettings || !interval) throw new Error('Failed - EcoVoiceAdd');
  const user = await database.findOne({ Guildid: server.id, Memberid: member.user.id });
  if (!user) {
    return EcoRegister(server, member);
  }
  const monthsInServer = (Date.now() - member.joinedTimestamp) / 2_629_700_000;
  const boostingServer = (Date.now() - member.premiumSinceTimestamp) / 2_629_700_000;
  let multipler = 1;
  multipler += monthsInServer * 0.01;
  multipler += server.premiumSubscriptionCount * 0.01;
  if (member.premiumSinceTimestamp) multipler += boostingServer * 0.01 + 0.05;
  const moneyAmount = serverSettings.ecoVCmoney / (60 / interval);
  const totalMoney = moneyAmount * multipler;
  await user.updateOne({
    Lastvoicestatus: Date.now(),
    $inc: { Money: totalMoney, Voicecount: interval / 3600 },
  });
}

async function EcoTextAdd(server, member, serverSettings) {
  if (!server || !member || !serverSettings) throw new Error('Failed - EcoTextAdd');
  const user = await database.findOne({ Guildid: server.id, Memberid: member.user.id });
  if (!user) {
    return EcoRegister(server, member);
  }
  const monthsInServer = (Date.now() - member.joinedTimestamp) / 2_629_700_000;
  const boostingServer = (Date.now() - member.premiumSinceTimestamp) / 2_629_700_000;
  let multipler = 1;
  multipler += monthsInServer * 0.01;
  multipler += member.guild.premiumSubscriptionCount * 0.01;
  if (member.premiumSinceTimestamp) multipler += boostingServer * 0.01 + 0.05;
  const moneyAmount = serverSettings.ecoMSGmoney * multipler;
  await user.updateOne({
    Lastmessagetime: Date.now(),
    $inc: { Money: moneyAmount, Messagescount: 1 },
  });

  const updateData = await database.findOne({ Guildid: server.id, Memberid: member.user.id });
  EcoLog(member, moneyAmount * multipler, updateData.Money, 'Wiadomość');
  if (serverSettings.Debug === '1') {
    Logger.log(
      chalk.green(`Wpływ na konto: ${moneyAmount.toFixed(2)}`) + chalk.blue(` | ${member.user.username}`),
      'eco',
    );
  }
}

module.exports = { EcoVoiceAdd, EcoRegister, EcoTextAdd };
