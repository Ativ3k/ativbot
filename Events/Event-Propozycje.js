const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const emoji = require('../json/emoji.json');
const db = require('../Models/propozycjedb');

client.on('messageCreate', async (message) => {
  if (message.channel.id === '1019689485144965191' && !message.author.bot) {
    const AUTOR = message.author;
    const TRESC = message.content;
    await message.delete();
    const PROPOZYCJE = client.channels.cache.get('1019689485144965191');

    const embed = new EmbedBuilder()
      .setTitle(`Propozycja | ${AUTOR.tag}`)
      .setDescription(`${TRESC}`)
      .setFields(
        { name: `‎`, value: `${emoji.TAK}\n 0`, inline: true },
        { name: `‎`, value: `${emoji.MINUS}\n 0`, inline: true },
        { name: `‎`, value: `${emoji.NIE}\n 0`, inline: true },
      )
      .setColor('#303236')
      .setFooter({
        text: `${AUTOR.tag} + ${AUTOR.id}`,
      });
    const button = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId('propozycjeyes').setStyle('Success').setEmoji(`${emoji.TAK}`))
      .addComponents(new ButtonBuilder().setCustomId('propozycjeidk').setStyle('Primary').setEmoji(`${emoji.MINUS}`))
      .addComponents(new ButtonBuilder().setCustomId('propozycjeno').setStyle('Danger').setEmoji(`${emoji.NIE}`))
      .addComponents(
        new ButtonBuilder().setCustomId('propozycjedelete').setStyle('Secondary').setEmoji(`${emoji.TRASH}`),
      )
      .addComponents(new ButtonBuilder().setCustomId('propozycjeinfo').setStyle('Secondary').setEmoji(`❓`));

    await PROPOZYCJE.send({ embeds: [embed], components: [button] });
    const lastmsg = await PROPOZYCJE.messages.fetch({ limit: 1 });
    await lastmsg.at(0).startThread({
      name: `Komentarze`,
      autoArchiveDuration: 10080,
      type: 'GUILD_PUBLIC_THREAD',
    });
    await new db({
      authorid: AUTOR.id,
      messageid: lastmsg.at(0).id,
    }).save();
  }
});
