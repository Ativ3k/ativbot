const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'ban',
  description: 'Zbanuj użytkownika.',
  userPermissions: 'KickMembers',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'user',
      description: 'Wybierz użytkownika.',
      required: true,
      type: ApplicationCommandOptionType.User,
    },

    {
      name: 'powód',
      description: 'Powód.',
      required: false,
      type: ApplicationCommandOptionType.String,
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
    const banTarget = interaction.options.getMember('user');
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('powód');
    const reasonFull = `${reason || '`Brak powodu`'} (${interaction.member.id})`;
    const time = Date.now() / 1000;

    if (banTarget === null) {
      const error = new EmbedBuilder().setColor('Red').setDescription(`${emoji.FAILURE} Nie znaleziono członka!`);
      return interaction.reply({ embeds: [error] });
    }
    if (banTarget.bannable) {
      const immunerole = '986017883727491132';
      if (banTarget.roles.cache.has(immunerole) === true) {
        const shield = new EmbedBuilder()
          .setColor('Red')
          .setDescription(`${emoji.SHIELDMOD} Ten użytkownik jest chroniony przez <@&${immunerole}>!`);
        return interaction.reply({ embeds: [shield] });
      }
    }
    if (!banTarget.bannable) {
      const noPerms = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`${emoji.FAILURE} Nie mam uprawnień aby zbanować tego użytkownika!`);
      return interaction.reply({ embeds: [noPerms] });
    }

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setDescription(
        `${emoji.BAN} **Zbanowano:** ${banTarget}.\n${emoji.MEMBER} **Przez:** <@${interaction.member.id}>\n${
          emoji.NOTE
        } **Powód:** ${reasonFull}\n${emoji.DATA} **Kiedy:** <t:${Number(time).toFixed(0)}:R>`,
      )
      .setFooter({ text: `${user.id || '??'} + ${user.username || '??'}` });

    banTarget.ban({ deleteMessageSeconds: 604800, reason: `${reasonFull}` }).catch((err) => {
      console.log(err);
    });
    return interaction.reply({ embeds: [embed] }).catch((err) => {
      interaction.reply({ embeds: [err] });
    });
  },
};
