const { EmbedBuilder } = require('discord.js');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
const client = require('../index');
require('dotenv').config();
const emoji = require('../json/emoji.json');
const ReplyContext = require('../Models/reply-context');
const cooldown = require('../Models/CommandCooldown');

const cooldownTime = 30;

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

  if (modal.customId === 'propozycje_poszukiwacz') {
    await modal.deferReply({ ephemeral: true });
    const propozycja = modal.getTextInputValue('sugest');

    const Discord = require('discord.js');
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: `${modal.user.username}`, iconURL: modal.user.displayAvatarURL() })
      .setDescription(`${propozycja}`)
      .setFooter({ text: `(+) Wysłane przez: ${modal.user.username}` });
    const oauth2Client = new OAuth2(
      process.env.nodemailer_clientId, // ClientID
      process.env.nodemailer_clientSecret, // Client Secret
      process.env.nodemailer_redirectURL, // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.nodemailer_refreshToken,
    });
    const accessToken = oauth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.nodemailer_user,
        clientId: process.env.nodemailer_clientId,
        clientSecret: process.env.nodemailer_clientSecret,
        refreshToken: process.env.nodemailer_refreshToken,
        accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailoptions = {
      from: process.env.nodemailer_user, // sender address
      to: process.env.nodemailer_sendToEmail, // list of receivers
      subject: 'DISCORD POSZUKIWACZ PROPOZYCJE', // Subject line
      html: `<head>${propozycja}</head> <br><br><b>Email wysłany przez ${modal.user.username} (${modal.user.id})</b>`, // html body
    };

    const teraz = modal.createdTimestamp / 1000;

    cooldown.findOne({ Cname: modal.customId, Uid: modal.user.id }, async (e, data) => {
      if (!data) {
        new cooldown({
          Cname: modal.customId,
          Uid: modal.user.id,
          Time: teraz,
        }).save();
        smtpTransport.sendMail(mailoptions);

        return modal.followUp({
          content: '**(!)** Twoja propozycja została wysłana do <@509173816673697794>',
          embeds: [embed],
          ephemeral: true,
        });
      }
      return 0;
    });

    const baza = await cooldown.findOne({
      Cname: modal.customId,
      Uid: modal.user.id,
    });
    const now = Date.now() / 1000;

    if (baza && now < baza.Time + cooldownTime) {
      const onCooldown = baza.Time + cooldownTime;
      return modal.reply(
        `Poczekaj! Aby uniknąć spamu możesz wysłać ponowną propozycje za <t:${onCooldown.toFixed(0)}:R>`,
      );
    }
    smtpTransport.sendMail(mailoptions);

    await modal.followUp({
      content: '**(!)** Twoja propozycja została wysłana do <@509173816673697794>',
      embeds: [embed],
      ephemeral: true,
    });
    await cooldown.findOneAndUpdate(
      {
        Uid: modal.user.id,
      },
      {
        Uid: modal.user.id,
        Time: teraz,
      },
    );
  }
  return 0;
});
