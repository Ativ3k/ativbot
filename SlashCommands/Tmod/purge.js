const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Usunięcie X wiadomości.',
  userPermissions: 'KickMembers',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'liczba',
      type: ApplicationCommandOptionType.Number,
      description: 'Ilość wiadomości',
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
    const embed = new EmbedBuilder()
      .setColor('#00E8FF')
      .setDescription('Wybierz prawidłową ilość, od **`1`** do **`99`**.');

    const amount = interaction.options.getNumber('liczba');
    if (amount < 1) {
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (amount > 99) {
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const { size } = await interaction.channel.bulkDelete(amount);
    const deleted = new EmbedBuilder()
      .setColor('#00E8FF')
      .setDescription(`**(!)** Usunięto **\`${size}\`** wiadomości.`)
      .setTimestamp();
    return interaction.reply({ embeds: [deleted], ephemeral: true });
  },
};
