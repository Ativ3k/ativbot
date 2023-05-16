const chalk = require('chalk');
const moment = require('moment');
const { Discord, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
const roles = require('../../json/roles.json');
const db = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');
const Logger = require('../../utils/logger');
const { EcoVoiceAdd } = require('./utils/MoneyAdd');

// todo
client.on('ready', async (oldState, newState) => {
  const interval = 3000;
  setInterval(async () => {
    const guilds = await guildSettings.find();
    guilds.forEach(async (guild) => {
      if (guild.ecoVC === '1') {
        const guildData = await client.guilds.cache.get(guild.GuildId);
        const guildMembers = guildData.members.cache.filter(
          (member) =>
            member.voice.channel &&
            member.voice.channel !== member.guild.afkChannel &&
            member.voice.channel.members.size > 0 &&
            !member.voice.mute,
        );
        guildMembers.forEach((member) => {
          EcoVoiceAdd(guildData, member, guild, interval / 1000);
        });
      }
    });
  }, interval);
});
