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
    const TARGET = interaction.options.getMember('user');
    const USER = interaction.options.getUser('user');
    const REASON = interaction.options.getString('powód');
    const powod = `${REASON || '`Brak powodu`'} (${interaction.member.id})`;
    const time = Date.now() / 1000;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setDescription(
        `${emoji.BAN} **Zbanowano:** ${TARGET}.\n${emoji.MEMBER} **Przez:** <@${interaction.member.id}>\n${
          emoji.NOTE
        } **Powód:** ${powod}\n${emoji.DATA} **Kiedy:** <t:${Number(time)}:R>`,
      )
      .setFooter({ text: `${USER.id || '??'} + ${USER.username || '??'}` });
    const error = new EmbedBuilder().setColor('Red').setDescription(`${emoji.FAILURE} Ten użytkownik jest chroniony!`);

    const immunerole = '986017883727491132';
    const roleimmune = TARGET.roles.cache.has(immunerole);

    if (TARGET.bannable) {
      if (TARGET === null) {
        return interaction.reply({ embeds: [error] });
      }

      if (roleimmune === true) {
        const shield = new EmbedBuilder()
          .setColor('Red')
          .setDescription(`${emoji.SHIELDMOD} Ten użytkownik jest chroniony przez <@&${immunerole}>!`);

        return interaction.reply({ embeds: [shield] });
      }
      if (!roleimmune === true) {
        TARGET.ban({ deleteMessageSeconds: 604800, reason: `${powod}` });
        interaction.reply({ embeds: [embed] }).catch((err) => {
          interaction.reply({ embeds: [err] });
        });
      }
    }
    if (!TARGET.bannable) {
      const cantban = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`${emoji.FAILURE} Nie mam uprawnień aby zbanować tego użytkownika!`);
      interaction.reply({ embeds: [cantban] });
    }
    return 0;
  },
};
