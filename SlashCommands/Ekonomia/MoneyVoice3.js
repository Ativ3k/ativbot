const { EmbedBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');
const Logger = require('../../utils/logger');
const { EcoVoiceAdd } = require('./utils/MoneyAdd');

// todo
client.on('ready', async () => {
  // voice
  const intervalVoice = 3000;
  setInterval(async () => {
    const guilds = await guildSettings.find();
    guilds.forEach(async (guild) => {
      if (guild.ecoVC === '1') {
        if (!client.guilds.cache.has(guild.GuildId)) return;
        const guildData = await client.guilds.cache.get(guild.GuildId);
        const guildMembers = guildData.members.cache.filter(
          (member) =>
            member.voice.channel &&
            member.voice.channel !== member.guild.afkChannel &&
            member.voice.channel.members.size > 1 &&
            !member.voice.mute,
        );
        guildMembers.forEach((member) => {
          EcoVoiceAdd(guildData, member, guild, intervalVoice / 1000);
        });
      }
    });
  }, intervalVoice);
  // daily coins for boosting members
  setInterval(async () => {
    const timeNow = new Date();
    if (timeNow.getHours() === 10 && timeNow.getMinutes() === 0 && timeNow.getSeconds() === 0) {
      const guilds = await guildSettings.find();
      guilds.forEach(async (guild) => {
        if (guild.ecoVC === '1') {
          if (!client.guilds.cache.has(guild.GuildId)) return;
          const guildData = await client.guilds.cache.get(guild.GuildId);
          const moneyValue = 200;
          const serverBoosters = guildData.members.cache.filter((member) => member.premiumSince);

          const embed = new EmbedBuilder()
            .setDescription(
              `${serverBoosters
                .map((member) => member)
                .sort((a, b) => a.premiumSinceTimestamp - b.premiumSinceTimestamp)
                .slice(0, 175)
                .join(', ')}`,
            )
            .setColor('Green');
          serverBoosters.forEach(async (member) => {
            const memberData = await db.findOne({ Memberid: member.id });
            await memberData.updateOne({ $inc: { Money: moneyValue } });
          });
          guildData.systemChannel.send({
            content: `Osoby wzmacniające serwer otrzymały ${moneyValue} ${emoji.jascoin}!`,
            embeds: [embed],
          });
        }
      });
    }
  }, 1000);
});
