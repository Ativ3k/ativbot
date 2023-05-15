const client = require('../index');
const emoji = require('../json/emoji.json');

client.on('messageCreate', async (message) => {
  const imagevideo = message.attachments.filter(
    (msg) => msg.contentType.includes('image') || msg.contentType.includes('video'),
  ).size;
  const image = message.attachments.filter((msg) => msg.contentType.includes('image')).size;
  if (!message.channel.name) {
    return;
  }
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
});
