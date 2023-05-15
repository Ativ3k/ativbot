const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  name: 'weryfikacja',
  description: 'Informacje o weryfikacji.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Discord.CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setAuthor({
        name: 'Informacje o weryfikacji.',
      })
      .setDescription(
        '**Cześć, widzę, że chcesz przejść weryfikację na <@&686205735868432390>.**\n\n' +
          'Co trzeba zrobić? Zdjęcie! Takie jak na dole z widoczną twarzą 👇 W jednej ręce trzymasz kartkę z napisanym discordowym nickiem+tag aktualną datą, a w drugiej swój dowód/prawko.\n' +
          '**PAMIĘTAJ aby z przyczyn bezpieczeństwa zamazać wszystkie dane (!)**, pozostawiając datę urodzenia i swoje zdjęcie z dokumentu!\n' +
          'Ticket weryfikacyjny możesz otworzyć na <#872072431295164416>.',
      )
      .setImage('https://cdn.discordapp.com/attachments/872072431295164416/943992178030542898/18plus.png')
      .setTimestamp()
      .setFooter({
        text: 'Wiemjak Info',
        iconURL: 'https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless',
      });

    await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
  },
};
