const { ApplicationCommandType, ModalBuilder, ActionRowBuilder, TextInputBuilder } = require('discord.js');

module.exports = {
  name: 'embed',
  description: 'Wyślij wiadomosc embed/messagecontent',
  defaultMemberPermissions: 'KickMembers',
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
    const modal = new ModalBuilder().setCustomId('msgmodal').setTitle('Wiadomość jako BOT');

    const MSGcontent = new TextInputBuilder()
      .setCustomId('msgcontent')
      .setLabel('Treść zwykłej wiadomości')
      .setStyle('Paragraph')
      .setMaxLength(3500)
      .setPlaceholder('Treść zwykłej wiadomości')
      .setRequired(false);

    const EMBEDcontent = new TextInputBuilder()
      .setCustomId('embedcontent')
      .setLabel('Treść wiadomości embed')
      .setStyle('Paragraph')
      .setMaxLength(3500)
      .setPlaceholder('Treść wiadomości embed')
      .setRequired(false);

    const eCOLOR = new TextInputBuilder()
      .setCustomId('ecolor')
      .setLabel('Kolor EMBED')
      .setStyle('Paragraph')
      .setMaxLength(3500)
      .setPlaceholder('Kolor EMBED')
      .setRequired(false);

    const msgcontent = new ActionRowBuilder().addComponents(MSGcontent);
    const color = new ActionRowBuilder().addComponents(eCOLOR);
    const embedcontent = new ActionRowBuilder().addComponents(EMBEDcontent);

    modal.addComponents(msgcontent, color, embedcontent);

    await interaction.showModal(modal);
  },
};
