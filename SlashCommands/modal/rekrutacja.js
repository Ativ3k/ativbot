const { ApplicationCommandType, TextInputBuilder, ModalBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'podanie',
  description: 'Wyślij swoje podanie!',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  userPermissions: 'KickMembers',
  defaultMemberPermissions: 'KickMembers',

  // test: true,
  // userPermissions: 'ADMINISTRATOR',
  // cooldown: 30,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */

  run: async (client, interaction) => {
    const ROLE = '981003431399522354';
    const hasRole = interaction.member.roles.cache.has(ROLE);
    if (hasRole) {
      interaction.reply({
        content:
          '<:failed:976683070516244490> **`Wysłałeś już wcześniej podanie!`**\n<a:animatearrow:981140155417108510> **`Sprawdź kanał`** <#980869650231484436>',
        ephemeral: true,
      });
    } else if (!hasRole) {
      const modal = new ModalBuilder().setCustomId('rekrutacja').setTitle('Rekrutacja do administracji');

      const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Jak masz na imię?')
        .setStyle('Short')
        .setMinLength(1)
        .setMaxLength(25)
        .setPlaceholder('Podaj swoje imię.')
        .setRequired(true);
      const age = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('Ile masz lat?')
        .setStyle('Short')
        .setMinLength(2)
        .setMaxLength(2)
        .setPlaceholder('Podaj swój wiek.')
        .setRequired(true);

      const text = new TextInputBuilder()
        .setCustomId('text')
        .setLabel('Dlaczego Ty?')
        .setStyle('Paragraph')
        .setMinLength(200)
        .setMaxLength(3500)
        .setPlaceholder('Dlaczego Ty masz dołączyć do administracji?')
        .setRequired(true);

      const namerow = new ActionRowBuilder().addComponents(name);
      const agerow = new ActionRowBuilder().addComponents(age);
      const textrow = new ActionRowBuilder().addComponents(text);

      modal.addComponents(namerow, agerow, textrow);

      interaction.showModal(modal);
    }
  },
};
