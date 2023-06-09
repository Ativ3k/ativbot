const Eco = require('../Models/Eco');
const { EcoRegister } = require('../SlashCommands/Ekonomia/utils/MoneyAdd');
const client = require('../index');
const emoji = require('../json/emoji.json');
const Logger = require('../utils/logger');

client.on('guildMemberAdd', async (member) => {
  const userData = await Eco.findOne({ Guildid: member.guild.id, Memberid: member.id });
  if (!userData) {
    EcoRegister(member.guild, member);
    return Logger.log(`Nowy członek! ${member.user.username} (${member.id})`, 'info');
  }
  return Logger.log(`Powracający członek! ${member.user.username} (${member.id})`, 'info');
});
