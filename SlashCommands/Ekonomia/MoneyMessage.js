const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');
const Logger = require('../../utils/logger');
const { EcoLog, EcoRegisterLog } = require('./utils/MoneyLog');
const { EcoRegister, EcoTextAdd } = require('./utils/MoneyAdd');

client.on('messageCreate', async (message) => {
  const autor = message.author;
  const time = message.createdTimestamp;
  if (message.author.bot) return;
  if (message.channel.type === 1) {
    const user = client.users.cache.get('258891606873210880');
    if (message.author.id === user.id) return;
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`Otrzymałem DM od ${message.author.tag} (${message.author.id})\n\`\`\`${message.content}\`\`\``);

    user.send({ embeds: [embed] });

    message.reply(
      `\`\`\`Hej! Nie przyjmuje wiadomości DM. W razie jakichkolwiek problemów lub pytań napisz do Ativa!\`\`\`` +
        `${user} (${user.id})\nhttps://discord.gg/wiemjak`,
    );
  }
  if (message.channel.type === 0) {
    if (message.author.bot) return;
    const serverSettings = await guildSettings.findOne({
      GuildId: message.guild.id,
    });
    if (!serverSettings) return;
    const amout = serverSettings.ecoMSGmoney;

    if (serverSettings.ecoMSG === '1') {
      const checkuser = await db.findOne({
        Guildid: message.guild.id,
        Memberid: autor.id,
      });
      if (checkuser && message.content.length > 10) {
        const checktime = await db.findOne({ Memberid: autor.id });
        const cdtime = Date.now() - checktime.Lastmessagetime;
        if (cdtime > 15000) {
          EcoTextAdd(message.guild, message.member, serverSettings);
        }
      }
    }
  }
});
