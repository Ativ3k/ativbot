const { WebhookClient, EmbedBuilder } = require('discord.js');
const client = require('../index');
require('dotenv').config();

client.on('modalSubmit', async (modal) => {
  if (modal.customId === 'rekrutacja') {
    const name = modal.getTextInputValue('name');
    const age = modal.getTextInputValue('age');
    const text = modal.getTextInputValue('text');
    const guild = client.guilds.cache.get('639632749610795009');

    const { user } = modal;
    const member = guild.members.cache.get(modal.user.id);
    const create = user.createdTimestamp / 1000;
    const join = member.joinedTimestamp / 1000;

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setAuthor({
        name: `${name} aka ${modal.user.tag}, ${age} lat`,
        iconURL: modal.user.displayAvatarURL(),
      })
      .setThumbnail(`${modal.user.displayAvatarURL()}`)
      .setDescription(`**Cześć! Jestem <@${modal.user.id}> i mam \`${age}\` lat a to jest moje podanie:**\n ${text} `)
      .addFields(
        { name: 'Konto od', value: `<t:${Number(create)}:R>`, inline: true },
        {
          name: 'Na serwerze od',
          value: `<t:${Number(join)}:R>`,
          inline: true,
        },
      )
      .setFooter({
        text: `ID: ${modal.user.id} ┃ /rekrutacja`,
      });

    const Rchannel = client.channels.cache.get('980869650231484436');

    const webhookClient = new WebhookClient({
      url: 'https://discord.com/api/webhooks/980871556710424596/4XDlNLigQahHiPLrP9TkqTH3_6KXmptVrgs9VSny9fqO2c5Vz0vBGChJ-h2ZyLKT5Fe3',
    });
    await webhookClient.send({
      username: modal.user.tag,
      avatarURL: modal.user.displayAvatarURL(),
      embeds: [embed],
    });
    await modal.deferReply({ ephemeral: true });
    modal
      .followUp({
        content:
          '<a:success:976092115119534150> **`Twoje podanie zostało wysłane!`**\n<a:animatearrow:981140155417108510> **`Sprawdź kanał`** <#980869650231484436>',
      })
      .then(() => {
        // Przechwycenie wiadomości dodanych z głównego kanału.
        Rchannel.messages.fetch({ limit: 1 }).then((messages) => {
          // Ostatnia wiadomość = pierwsza wiadomość.
          const lastMessage = messages.first();
          // Dodanie reakcji
          lastMessage.react('<:tak:977079038113898496>');
          lastMessage.react('<:minus:977079055381827584>');
          lastMessage.react('<:nie:977079073643839498>');
          // Utworzenie wątku
          // lastMessage.startThread({
          //     name: `Komentarze`,
          //     autoArchiveDuration: 10080,
          //     type: 'GUILD_PUBLIC_THREAD'
          // })
        });
      });
    const ROLE = '981003431399522354';
    const target = modal.member;
    target.roles.add(ROLE);
  }
});
