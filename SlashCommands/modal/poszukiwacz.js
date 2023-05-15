const { ApplicationCommandType, TextInputBuilder, ModalBuilder } = require('discord.js');

module.exports = {
  name: 'poszukiwacz',
  description: 'Wyślij swoją propozycje na odcinek poszukiwacza!',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */

  run: async (client, interaction) => {
    const textinput = new TextInputBuilder()
      .setCustomId('sugest')
      .setLabel('Propozycja:')
      .setStyle('LONG')
      .setMinLength(1)
      .setPlaceholder('Tutaj napisz swoją propozycje do filmiku poszukiwacza!')
      .setRequired(true);

    const modal = new ModalBuilder()
      .setCustomId('propozycje')
      .setTitle('Propozycje dla Poszukiwacza')
      .addComponents([textinput]);

    interaction.showModal(modal, {
      client,
      interaction,
    });
  },
};
