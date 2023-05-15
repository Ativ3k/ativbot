const { EmbedBuilder } = require('discord.js');
const client = require('../index');
require('dotenv').config();
const emoji = require('../json/emoji.json');
const ReplyContext = require('../Models/reply-context');

client.on('modalSubmit', async (modal) => {
  if (modal.customId === 'msgmodal') {
    const content = modal.getTextInputValue('msgcontent');
    const econtent = modal.getTextInputValue('embedcontent');
    const ecolor = modal.getTextInputValue('ecolor');
    const embed = new EmbedBuilder().setColor(`${ecolor || '#303236'}`).setDescription(`${econtent}`);

    if (!econtent) {
      modal.channel.send({ content: `${content}` });
      await modal.deferReply({ ephemeral: true });
      modal.followUp({
        content: `${emoji.SUCCESS} Pomyślnie wysłano wiadomość!`,
        ephemeral: true,
      });
    } else if (econtent) {
      modal.channel.send({ content: `${content || ''}`, embeds: [embed] });
      await modal.deferReply({ ephemeral: true });
      modal.followUp({
        content: `Pomyślnie wysłano wiadomość!`,
        ephemeral: true,
      });
    }
  }

  if (modal.customId === 'msgcontext') {
    const content = modal.getTextInputValue('msgcontent');
    const econtent = modal.getTextInputValue('embedcontent');
    const ecolor = modal.getTextInputValue('ecolor');

    const embed = new EmbedBuilder().setColor(`${ecolor || 'Green'}`).setDescription(`${econtent}`);

    const msgid = await ReplyContext.findOne({ userID: modal.user.id });

    if (!econtent) {
      modal.channel.send({
        content: `${content}`,
        reply: { messageReference: `${msgid.messageIDreply}` },
      });
      await modal.deferReply({ ephemeral: true });
      modal.followUp({
        content: `${emoji.SUCCESS} Pomyślnie wysłano wiadomość!`,
        ephemeral: true,
      });
    } else if (econtent) {
      modal.channel.send({
        content: `${content || ''}`,
        embeds: [embed],
        reply: { messageReference: `${msgid.messageIDreply}` },
      });
      await modal.deferReply({ ephemeral: true });
      modal.followUp({
        content: `Pomyślnie wysłano wiadomość!`,
        ephemeral: true,
      });
    }
  }
});
