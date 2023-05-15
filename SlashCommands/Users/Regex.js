const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'regex',
  description: 'Sprawdź czy nick spełnia wymagany Regex.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'użytkownik',
      description: 'Wybierz użytkownika.',
      required: false,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'nick',
      description: 'Wpisz dowolny ciąg znaków.',
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */

  run: async (client, interaction) => {
    const regex = /\w{2}[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻżvVxX0123456789]/g;
    const USER = interaction.options.getMember('użytkownik');
    const NICK = interaction.options.getString('nick');

    if (!USER && !NICK) {
      const REPLY = regex.test(interaction.member.displayName);
      if (REPLY) {
        const embed = new EmbedBuilder().setDescription(
          `${emoji.SUCCESS} **Twój nick \`(${interaction.member.displayName})\` spełnia [Regex](https://regexr.com/7asun)!**`,
        );
        return interaction.reply({ embeds: [embed] });
      }
      const embed = new EmbedBuilder().setDescription(
        `${emoji.SUCCESS} **Twój nick \`(${interaction.member.displayName})\` nie spełnia [Regex](https://regexr.com/7asun)!**`,
      );
      return interaction.reply({ embeds: [embed] });
    }
    if (USER) {
      const mUSER = USER.displayName;
      const fUSER = regex.test(mUSER);
      if (fUSER) {
        const embed = new EmbedBuilder().setDescription(
          `${emoji.SUCCESS} **Nick \`(${mUSER})\` spełnia [Regex](https://regexr.com/7asun)!**`,
        );
        return interaction.reply({ embeds: [embed] });
      }
      const embed = new EmbedBuilder().setDescription(
        `${emoji.SUCCESS} **Nick \`(${mUSER})\` nie spełnia [Regex](https://regexr.com/7asun)!**`,
      );
      return interaction.reply({ embeds: [embed] });
    }

    if (NICK) {
      const fNICK = regex.test(NICK);
      if (fNICK) {
        const embed = new EmbedBuilder().setDescription(
          `${emoji.SUCCESS} **Nick \`${NICK}\` spełnia [Regex](https://regexr.com/7asun)!**`,
        );
        return interaction.reply({ embeds: [embed] });
      }
      const embed = new EmbedBuilder().setDescription(
        `${emoji.SUCCESS} **Nick \`${NICK}\` nie spełnia [Regex](https://regexr.com/7asun)!**`,
      );
      return interaction.reply({ embeds: [embed] });
    }
    return 0;
  },
};
