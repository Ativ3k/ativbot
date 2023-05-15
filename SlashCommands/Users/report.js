const {
  ApplicationCommandType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ApplicationCommandOptionType,
} = require('discord.js');

const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'report',
  description: 'Zgłoszenie użytkownika',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'użytkownik',
      type: ApplicationCommandOptionType.User,
      description: 'Wybierz użytkownika',
      required: true,
    },
    {
      name: 'powód',
      type: ApplicationCommandOptionType.String,
      description: 'Podaj powód',
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
    const zgloszony = interaction.options.getUser('użytkownik');
    const powod = interaction.options.getString('powód');
    const reports = require('../../Models/report');

    const report = new EmbedBuilder()
      .setColor('Red')
      .setAuthor({
        name: `${zgloszony.tag}, (${zgloszony})`,
        iconURL: zgloszony.displayAvatarURL(),
      })
      .setThumbnail(zgloszony.displayAvatarURL())
      .setTitle('**(!)** Zgłoszenie')
      .setDescription(`**Treść:**\n${powod}`)
      .addFields(
        { name: 'Zgłoszony', value: `${zgloszony}`, inline: true },
        { name: 'Przez', value: `<@${interaction.user.id}>`, inline: true },
      )
      .setTimestamp();

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reportpositive')
          .setLabel('Prawda')
          .setStyle('Success')
          .setEmoji(`${emoji.SUCCESS}`),
      )
      .addComponents(new ButtonBuilder().setCustomId('reportidk').setLabel('IDK').setStyle('Secondary').setEmoji(`⚠️`))
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reportfalse')
          .setLabel('Fałsz')
          .setStyle('Danger')
          .setEmoji(`${emoji.FAILURE}`),
      );

    reports.findOne(
      {
        guildId: interaction.guild.id,
      },
      async (err, data) => {
        if (!data) {
          interaction.reply({
            content: '❌ Brak kanału zgłoszeń!\n➡ Ustaw kanał komendą **`/admin-report`**',
            ephemeral: true,
          });
        }
        if (data) {
          const reportschannel = client.channels.cache.get(data.reportchannel);
          if (reportschannel === undefined)
            return interaction.reply({
              content: '❌ Brak kanału zgłoszeń!\n➡ Ustaw kanał komendą **`/admin-report`**',
              ephemeral: true,
            });
          reportschannel.send({
            embeds: [report],
            components: [buttons],
          });
          interaction.reply({
            content: 'Twoje zgłoszenie zostało wyslane do administracji!',
            embeds: [report],
            ephemeral: true,
          });
        }
        return 0;
      },
    );
  },
};
