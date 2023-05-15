const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const Weryfikacja18 = require('../../Models/TicketPanel');

module.exports = {
  name: 'admin-weryfikacja',
  description: 'Konfiguracja ticket-weryfikacji.',
  userPermissions: 'Administrator',
  defaultMemberPermissions: 'Administrator',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'everyone',
      type: ApplicationCommandOptionType.String,
      description: 'ID roli @everyone',
      required: true,
    },
    {
      name: 'staff',
      type: ApplicationCommandOptionType.String,
      description: 'ID roli administracyjnej',
      required: true,
    },
    {
      name: 'kategoria',
      type: ApplicationCommandOptionType.String,
      description: 'ID kategorii w której bedą tworzone tickety.',
      required: true,
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
    let everyoneId = interaction.options.getString('everyone');
    let staffId = interaction.options.getString('staff');
    let categoryId = interaction.options.getString('kategoria');

    await Weryfikacja18.findOne(
      {
        guildId: interaction.guild.id,
      },
      async (err, data) => {
        if (data) data.delete();
        new Weryfikacja18({
          guildId: interaction.guild.id,
          everyone: everyoneId,
          staff: staffId,
          category: categoryId,
        }).save();
      },
    );

    const weryfikacjaData = await Weryfikacja18.findOne({
      guildId: interaction.guild.id,
    });

    everyoneId = weryfikacjaData.everyone;
    staffId = weryfikacjaData.staff;
    categoryId = weryfikacjaData.category;

    const embed = new EmbedBuilder()
      .setColor('#F5A623')
      .setDescription(
        `<a:success:976092115119534150> Rola <@&${everyoneId}> została pomyślnie dodana!\n` +
          `<a:success:976092115119534150> Rola <@&${staffId}> została pomyslnie dodana jako rola administracyjna!\n` +
          `<a:success:976092115119534150> Kategoria **<#${categoryId}>** została ustawiona pomyślnie!`,
      );

    interaction.reply({ embeds: [embed] });
  },
};
