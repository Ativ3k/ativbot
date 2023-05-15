const client = require('../index');
require('dotenv').config();
const guildSettings = require('../Models/GuildSettings');

client.on('guildCreate', async (guild) => {
  const data = await guildSettings.findOne({ GuildId: guild.id });
  if (!data) {
    await guildSettings
      .create({
        GuildId: guild.id,
        GuildPremiumTime: 0,
        Debug: 0,
        ecoVC: 0,
        ecoVCmoney: 1,
        ecoVCxp: 15,
        ecoMEM: 0,
        ecoMEMmoney: 15,
        ecoMEMxp: 45,
        ecoMSG: 0,
        ecoMSGmoney: 0.25,
        ecoMSGxp: 15,
        ecoMSGdelay: 15,
        VoiceLog: 0,
        VoiceLogChannel: 0,
      })
      .save();
    console.log(`Joined to ${guild.name} (${guild.id}), created config.`);
  } else {
    console.log(`Joined to ${guild.name} (${guild.id}), config exist.`);
  }
});
