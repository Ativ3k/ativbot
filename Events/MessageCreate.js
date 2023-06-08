const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const emoji = require('../json/emoji.json');
const dbPropozycje = require('../Models/propozycjedb');

client.on('messageCreate', async (message) => {
  // dobranocka
  const dobranocID = '159760934036963329';
  if (message.author.id === dobranocID && message.content.includes('Dobranocka')) {
    message.reply(`Dobranoc seksowny gnojku ❤${emoji.PEPEBEDGE}`);
  }
  // ram usage
  if (message.author.id === '258891606873210880' && message.content.includes('!bench')) {
    const ram = process.memoryUsage().heapTotal / 1024 / 1024;
    message.reply(`result: ${ram}`);
  }

  // media channel
  const imagevideo = message.attachments.filter(
    (msg) => msg.contentType.includes('image') || msg.contentType.includes('video'),
  ).size;
  const image = message.attachments.filter((msg) => msg.contentType.includes('image')).size;
  if (!message.channel.name) {
    return;
  }
  if (message) {
    // memiki
    if (message.channel.name.includes('memiki') && !message.author.bot) {
      if (message.content.includes('.png')) {
        return;
      }

      if (message.content.includes('.jpg')) {
        return;
      }

      if (message.content.includes('.jpeg')) {
        return;
      }

      if (message.content.includes('.gif')) {
        return;
      }

      if (message.content.includes('prnt.sc')) {
        return;
      }

      if (imagevideo === 0) {
        message.delete();
        return;
      }

      message.react(`${emoji.TAK}`);
      message.react(`${emoji.MINUS}`);
      message.react(`${emoji.NIE}`);
      message.startThread({
        name: `Komentarze`,
        autoArchiveDuration: 1440,
        type: 'GUILD_PUBLIC_THREAD',
      });
    }
    // selfie
    if (message.channel.name.includes('selfie') && !message.author.bot) {
      if (message.content.includes('.png')) {
        return;
      }

      if (message.content.includes('.jpg')) {
        return;
      }

      if (message.content.includes('.jpeg')) {
        return;
      }

      if (message.content.includes('.gif')) {
        return;
      }
      if (message.content.includes('prnt.sc')) {
        return;
      }

      if (image === 0) message.delete();
    }
  }
  // end media channel

  // propozycje
  if (message.channel.id === '1019689485144965191' && !message.author.bot) {
    const msgAuthor = message.author;
    const msgContent = message.content;
    await message.delete();
    const PROPOZYCJE = client.channels.cache.get('1019689485144965191');

    const embed = new EmbedBuilder()
      .setTitle(`Propozycja | ${msgAuthor.username}`)
      .setDescription(`${msgContent}`)
      .setFields(
        { name: `‎`, value: `${emoji.TAK}\n 0`, inline: true },
        { name: `‎`, value: `${emoji.MINUS}\n 0`, inline: true },
        { name: `‎`, value: `${emoji.NIE}\n 0`, inline: true },
      )
      .setColor('#303236')
      .setFooter({
        text: `${msgAuthor.username} + ${msgAuthor.id}`,
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
    await new dbPropozycje({
      authorid: msgAuthor.id,
      messageid: lastmsg.at(0).id,
    }).save();
  }
  // end propozycje
});
