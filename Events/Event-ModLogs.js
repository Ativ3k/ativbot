const { EmbedBuilder } = require('discord.js');
const client = require('../index');

const channelId = '679054786649128999';
const emoji = require(`../json/emoji.json`);

client.on('guildBanAdd', async (member) => {
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: '22',
  });
  const banLog = fetchedLogs.entries.first();
  if (!banLog) return;
  const { executor, target } = banLog;

  const time = Date.now() / 1000;
  const embed = new EmbedBuilder()
    .setColor('Red')
    .setDescription(
      `${emoji.BAN} **Zbanowano:** ${member.user}\n${emoji.MEMBER} **Przez:** <@${executor.id}>\n${
        emoji.NOTE
      } **Powód:** ${banLog.reason || '`Brak powodu`'}\n${emoji.DATA} **Kiedy:** <t:${Number(time)}:R>`,
    )
    .setFooter({
      text: `${member.user.id || '??'} + ${member.user.tag || '??'}`,
    });
  // const DM = new EmbedBuilder()
  //   .setColor('Red')
  //   .setDescription(
  //     `${emoji.BAN} **Zostałeś zbanowany na:** \`Wiemjak\`\n${emoji.MEMBER} **Przez:** <@${executor.id}>\n${
  //       emoji.NOTE
  //     } **Powód:** ${banLog.reason || '`Brak powodu`'}\n${emoji.DATA} **Kiedy:** <t:${Number(time)}:R>`,
  //   )
  //   .setFooter({ text: 'Discord.gg/wiemjak' });

  const channel = member.guild.channels.cache.get(channelId);
  if (target.id === member.user.id) {
    // try {
    //   target.send({ embeds: [DM] })
    // }
    // catch (err ){
    //   console.log("Użytkownik ma zablokowane DM!")
    // }
    channel.send({ embeds: [embed] });
  }
});

client.on('guildMemberRemove', async (member) => {
  const time = Date.now() / 1000;
  const kick = await member.guild.fetchAuditLogs({
    limit: 1,
    type: '20',
  });
  const kickLog = kick.entries.first();

  if (!kickLog) return;
  const { executor, target } = kickLog;
  const kicklogtime = kickLog.createdTimestamp / 1000;
  const roznica = time - kicklogtime;
  if (roznica < 2) {
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setDescription(
        `${emoji.KICK} **Wyrzucono:** ${member.user}\n${emoji.MEMBER} **Przez:** <@${executor.id}>\n${
          emoji.NOTE
        } **Powód:** ${kickLog.reason || '`Brak powodu`'}\n${emoji.DATA} **Kiedy:** <t:${Number(time)}:R>`,
      )
      .setFooter({
        text: `${member.user.id || '??'} + ${member.user.tag || '??'}`,
      });

    // const DM = new EmbedBuilder()
    //   .setColor('Orange')
    //   .setDescription(
    //     `${emoji.KICK} **Zostałeś wyrzucony z:** \`Wiemjak\`\n${emoji.MEMBER} **Przez:** <@${executor.id}>\n${
    //       emoji.NOTE
    //     } **Powód:** ${kickLog.reason || '`Brak powodu`'}\n${emoji.DATA} **Kiedy:** <t:${parseInt(time)}:R>`,
    //   )
    //   .setFooter({ text: 'Discord.gg/wiemjak' });

    const channel = member.guild.channels.cache.get(channelId);
    if (target.id === member.user.id) {
      // try {
      //   target.send({ embeds: [DM] })
      // }
      // catch (err ){
      //   console.log("Użytkownik ma zablokowane DM!")
      // }
      channel.send({ embeds: [embed] });
    }
  }
});
