const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'role',
  description: 'Informacje o rolach rankingowych.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor('#55ff55')
      .setAuthor({
        name: 'Role za aktywność.',
      })
      .setDescription(
        `**Rangi otrzymujemy za aktywność liczoną w punktach XP.` +
          `\nLista rang które możemy zdobyć od największej do najmniejszej:` +
          `\n${emoji.GWIAZDKA} = <@&872270249305726976> ` +
          `\n${emoji.PRZYJACIEL} = <@&770257532643967000> ` +
          `\n${emoji.WIEMJAK} = <@&770257476926439445>` +
          `\n${emoji.STALYBYWALEC} = <@&704358088051785886>` +
          `\n${emoji.NASZZIOMEK} = <@&717035206493864069>` +
          `\n${emoji.KOLEGA} = <@&704358064920461343>` +
          `\n${emoji.PERSONA} = <@&704358019923968011>` +
          `\n${emoji.POSZUKIWACZ} = <@&717037370649608212>` +
          `\n${emoji.CZŁONEK} = <@&872268794851119165>` +
          `\n${emoji.ŚWIEŻAK} = <@&640549668501192726> 0 lvl, akceptacja regulaminu**`,
      )
      .addFields(
        {
          name: ':military_medal: Punkty XP:',
          value: `\`\`\`🎙 10XP/min\`\`\``,
          inline: true,
        },
        { name: '‎', value: `\`\`\`✍ 16XP/text\`\`\``, inline: true },
        { name: '‎', value: `\`\`\`❤ 100XP/upvote\`\`\``, inline: true },
        { name: '🏆 Bonus:', value: `\`\`\`🎙 15XP/min\`\`\``, inline: true },
        { name: '‎', value: `\`\`\`✍ 25XP/text\`\`\``, inline: true },
        { name: '‎', value: `\`\`\`❤ 150XP/upvote\`\`\``, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: 'Wiemjak Role',
        iconURL: 'https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless',
      });
    interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
  },
};
