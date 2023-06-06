const {
  ApplicationCommandType,
  TextInputBuilder,
  ModalBuilder,
  CommandInteraction,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  name: 'poszukiwacz',
  description: 'Wyślij swoją propozycje na odcinek poszukiwacza!',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @raturns
   */

  run: async (client, interaction) => {
    const textinput = new TextInputBuilder()
      .setCustomId('sugest')
      .setLabel('Propozycja:')
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(20)
      .setMaxLength(3500)
      .setPlaceholder('Tutaj napisz swoją propozycje do filmiku poszukiwacza!')
      .setRequired(true);

    const modal = new ModalBuilder().setCustomId('propozycje_poszukiwacz').setTitle('Propozycje dla Poszukiwacza');
    const sugest = new ActionRowBuilder().addComponents(textinput);
    modal.addComponents(sugest);
    interaction.showModal(modal);
  },
};
