const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'picipolo',
  description: 'Ulubiona gra Adama!',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'liczba',
      type: ApplicationCommandOptionType.Number,
      description: 'Wybierz liczbe',
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    const memberValue = interaction.options.getNumber('liczba');
    const botValue = interaction.options.getNumber('liczba') + 1;
    if (botValue !== 69) {
      interaction.reply({
        content: `Wygrałem haha! Wybrałeś **${memberValue}** a ja **${botValue}**.\nMoże następnym razem uda Ci sie wygrać!`,
      });
    } else if (botValue === 69) {
      interaction.reply({
        content: `Wygrałem haha! Wybrałeś **${memberValue}** a ja **${botValue}**. ||Przypadek? Nie sądze. 😎||\nMoże następnym razem uda Ci sie wygrać!`,
      });
    }
  },
};
