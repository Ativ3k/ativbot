const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'say',
  description: 'Napisz jako BOT.',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'tekst',
      type: ApplicationCommandOptionType.String,
      description: 'Tekst który napisze bot',
      required: true,
    },
    {
      name: 'id',
      type: ApplicationCommandOptionType.String,
      description: 'ID wiadomości do odpowiedzi. (WIADOMOŚĆ MUSI BYĆ NA TYM SAMYM KANALE CO UŻYTA JEST KOMENDA)',
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const tekst = await interaction.options.getString('tekst');
    const replyid = await interaction.options.getString('id');
    const str = tekst.replace('/n ', '\n');
    try {
      if (!replyid) {
        interaction.reply({
          content: `${process.env.SUCCESS_EMOJI} sukces!`,
          ephemeral: true,
        });
        interaction.channel.send(str);
      }
      if (replyid) {
        interaction.channel.send({
          content: str,
          reply: { messageReference: replyid },
        });
        interaction.reply({
          content: `${process.env.SUCCESS_EMOJI} sukces!`,
          ephemeral: true,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `<:failed:976683070516244490> Błędne **\`id\`**!`,
        ephemeral: true,
      });
    }
    const logi = new EmbedBuilder()
      .setDescription(
        `❓ **\`Kto:\`** ${interaction.member.user}  **|**  **\`Co:\`** /say\n${emoji.CHANNEL} **\`Kanał:\`** ${interaction.channel}\n📝 **\`Napisał:\`**\n**${tekst}**`,
      )
      .setColor('BLUE')
      .setFooter({
        text: `${interaction.member.user.id} + ${interaction.member.user.tag}`,
      });
    const logs = client.channels.cache.get('1038818887136981022');
    logs.send({ embeds: [logi] });
  },
};
