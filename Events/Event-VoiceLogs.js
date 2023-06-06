const { EmbedBuilder } = require('discord.js');
const client = require('../index');
const emoji = require('../json/emoji.json');
const guildSettings = require('../Models/GuildSettings');

client.on('voiceStateUpdate', async (oldState, newState) => {
  const data = await guildSettings.findOne({ GuildId: oldState.guild.id });
  const data2 = await guildSettings.findOne({ GuildId: newState.guild.id });
  if (!data) return;
  if (!data2) return;
  const channelId = data.VoiceLogChannel || data2.VoiceLogChannel;
  const channel = newState.guild.channels.cache.get(channelId);
  if (channel === undefined) return;

  if (data.VoiceLog === '1' && data.VoiceLogChannel > 0) {
    /* Ignore bots and same state channel */
    if (oldState.channelId === newState.channelId) return;
    if ((oldState.member && oldState.member.user.bot) || !oldState.member) return;
    if ((newState.member && newState.member.user.bot) || !newState.member) return;

    /* Join channel */
    if (oldState.channel === null && newState.channel) {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({
          name: `${newState.member.user.tag} (${newState.member.user.id})`,
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(` ${emoji.JOIN} ${newState.member} **dołączył \`${newState.channel.name}\`.**`)
        .setTimestamp();
      channel.send({ embeds: [embed] });

      /* Text in Voice logs */
      newState.channel.send({ content: `${oldState.member} **dołączył.**`, allowedMentions: { parse: [] } });
      /* end Text in Voice logs */

      if (newState.member.id === '309665062224658438') {
        newState.channel.permissionOverwrites.edit('325958892028690433', {
          ViewChannel: false,
        });
      }
    }
    /* end Join channel */

    /* leave channel */
    if (oldState.channel && newState.channelId === null) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({
          name: `${oldState.member.user.tag} (${oldState.member.user.id})`,
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(`${emoji.LEAVE} ${oldState.member} **opuścił \`${oldState.channel.name}\`.**`)
        .setTimestamp();

      channel.send({ embeds: [embed] });

      /* Text in Voice logs */
      setTimeout(() => {
        const ifExistOld = oldState.guild.channels.cache.get(oldState.channelId);
        if (ifExistOld) {
          oldState.channel.send({ content: `${oldState.member} **wyszedł.**`, allowedMentions: { parse: [] } });
        }
      }, 1000);
      /* end Text in Voice logs */

      if (newState.member.id === '309665062224658438') {
        oldState.channel.permissionOverwrites.delete('325958892028690433');
      }
    }

    /* Change channel */
    if (oldState.channel && newState.channel) {
      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({
          name: `${oldState.member.user.tag} (${oldState.member.user.id})`,
          iconURL: newState.member.displayAvatarURL(),
        })
        .setDescription(`${oldState.member} **zmienił \`${oldState.channel.name}\` => \`${newState.channel.name}\`.**`)
        .setTimestamp();
      channel.send({ embeds: [embed] });

      /* Text in Voice logs */
      setTimeout(() => {
        const ifExistOld = oldState.guild.channels.cache.get(oldState.channelId);
        if (ifExistOld) {
          oldState.channel.send({ content: `${oldState.member} **wyszedł.**`, allowedMentions: { parse: [] } });
        }
      }, 1000);
      newState.channel.send({ content: `${oldState.member} **dołączył.**`, allowedMentions: { parse: [] } });
      /* end Text in Voice logs */

      if (newState.member.id === '309665062224658438') {
        oldState.channel.permissionOverwrites.delete('325958892028690433');
        newState.channel.permissionOverwrites.edit('325958892028690433', {
          ViewChannel: false,
        });
      }
    }
    /* end Change channel */
  }
});
