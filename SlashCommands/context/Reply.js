const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require('discord.js');
const ReplyContext = require('../../Models/reply-context');

module.exports = {
  name: 'Odpowiedz (BOT)',
  type: 3,
  defaultMemberPermissions: 'KickMembers',
  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const modal = new ModalBuilder().setCustomId('msgcontext').setTitle('Wiadomość jako BOT');

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

    const IDmessage = interaction.targetId;

    ReplyContext.findOne(
      {
        userID: interaction.member.id,
      },
      async (err, data) => {
        if (!data) {
          new ReplyContext({
            userID: interaction.member.id,
            messageIDreply: IDmessage,
            interactionName: interaction.commandName,
          }).save();
        }
        if (data) {
          data.delete();
          new ReplyContext({
            userID: interaction.member.id,
            messageIDreply: IDmessage,
            interactionName: interaction.commandName,
          }).save();
        }
      },
    );
  },
};
