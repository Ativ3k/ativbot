const { EmbedBuilder } = require('discord.js');
const client = require('../../../index');
const emoji = require('../../../json/emoji.json');

async function EcoLog(autor, data, updatedata, reason) {
  const ecolog = await client.channels.cache.get('970062741861707806');
  const embed = new EmbedBuilder()
    .setColor('Yellow')
    .setDescription(
      `**Wpływ na konto:** <@${autor.id}> **=>** ${data.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.toFixed(2)}${
        emoji.jascoin
      } | Za: **\`${reason}\`**`,
    );
  ecolog.send({ embeds: [embed] });
}

async function EcoRegisterLog(autor) {
  const ecolog = await client.channels.cache.get('970062741861707806');
  const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`**Zarejestrowano nową osobe:** <@${autor.id}> **=>** 1${emoji.jascoin}`);
  ecolog.send({ embeds: [embed] });
}

module.exports = { EcoLog, EcoRegisterLog };
