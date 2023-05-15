const Eco = require('../Models/Eco');
const GuildSettings = require('../Models/GuildSettings');
const { EcoRegister } = require('../SlashCommands/Ekonomia/utils/MoneyAdd');
const client = require('../index');
const emoji = require('../json/emoji.json');
const Logger = require('../utils/logger');

client.on('guildMemberAdd', async (member) => {
  const userData = await Eco.findOne({ Guildid: member.guild.id, Memberid: member.id });
  const settingsData = await GuildSettings.findOne({ GuildId: member.guild.id });
  if (!userData) {
    EcoRegister(settingsData, member);
    return Logger.log(`Nowy członek! ${member.user.tag} (${member.id})`, 'info');
  }
  return Logger.log(`Powracający członek! ${member.user.tag} (${member.id})`, 'info');
});
