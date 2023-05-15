const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const reportChannel = require('../../Models/report');

module.exports = {
  name: 'admin-report',
  description: 'Konfiguracja kanału zgłoszeń.',
  defaultMemberPermissions: 'Administrator',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'channel',
      type: ApplicationCommandOptionType.String,
      description: 'ID kanału z zgłoszeniami',
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
    const chanell = interaction.options.getString('channel');
    const embed = new EmbedBuilder()
      .setColor('#F5A623')
      .setDescription(`Kanał <#${chanell}> został ustawiony jako kanał zgłoszeń.`);

    reportChannel.findOne(
      {
        guildId: interaction.guild.id,
      },
      async (err, data) => {
        if (data) {
          data.delete();
          new reportChannel({
            guildId: interaction.guild.id,
            reportchannel: chanell,
          }).save();
        }
        if (!data)
          new reportChannel({
            guildId: interaction.guild.id,
            reportchannel: chanell,
          }).save();
        interaction.reply({
          embeds: [embed],
        });
      },
    );
  },
};
