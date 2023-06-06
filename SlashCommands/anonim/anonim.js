const { ApplicationCommandType, ModalBuilder, ActionRowBuilder, TextInputBuilder } = require('discord.js');

module.exports = {
  name: 'anonim',
  description: 'Wyślij swojego anonima!',
  cooldown: 30,
  nolog: true,
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
    const modal = new ModalBuilder().setCustomId('anonmodal').setTitle('Anonimowa wiadomość');

    const tresc = new TextInputBuilder()
      .setCustomId('anontresc')
      .setLabel('Treść Twojego anonima:')
      .setStyle('Paragraph')
      .setMinLength(1)
      .setMaxLength(3500)
      .setPlaceholder('Napisz swojego anonima tutaj!')
      .setRequired(true);

    const kontent = new ActionRowBuilder().addComponents(tresc);

    modal.addComponents(kontent);

    await interaction.showModal(modal);
  },
};
