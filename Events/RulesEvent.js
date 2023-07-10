const { EmbedBuilder } = require('discord.js');
const client = require('../index');

const emoji = require('../json/emoji.json');

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === 'rulesaccept') {
    const ROLE = [
      '640549668501192726',
      '871178101290336286',
      '871177365009604628',
      '871180328784494602',
      '871177667263742002',
      '871136668869066762',
      '871178311806636032',
      '1018474529149947905',
    ];
    const hasRole = interaction.member.roles.cache.has(ROLE);
    const target = interaction.member.roles;

    const Ehasrole = new EmbedBuilder().setDescription('**`Już zaakceptowałeś/aś regulamin!`**').setColor('Green');

    const odcinekUrl = 'https://discord.com/channels/639632749610795009/640536332497584149/1128038011783884800'
    const EDhasrole = new EmbedBuilder()
      .setDescription(`**\`Zaakceptowałeś/aś regulamin!\`** ${emoji.GLADHAT}\nOdcinek znajdziesz tutaj: ${odcinekUrl}`)
      .setColor('Green');

    if (hasRole) {
      interaction.reply({ embeds: [Ehasrole], ephemeral: true });
    } else if (!hasRole) {
      interaction.reply({ embeds: [EDhasrole], ephemeral: true });
      target.add(ROLE);
    }
  }
});
