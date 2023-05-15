const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'admin-anonim',
  description: 'Konfiguracja anonimowych wiadomości.',
  userPermissions: 'Administrator',
  defaultMemberPermissions: 'Administrator',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'channel',
      type: ApplicationCommandOptionType.String,
      description: 'ID kanału z weryfikacją',
      required: true,
    },
    {
      name: 'anonimowe',
      type: ApplicationCommandOptionType.String,
      description: 'ID kanału z anonimami',
      required: true,
    },
    {
      name: 'webhookurl',
      type: ApplicationCommandOptionType.String,
      description: 'Link Webhook',
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
    const Anony = require('../../Models/anonimSchema');
    const chanell = interaction.options.getString('channel');
    const webhok = interaction.options.getString('webhookurl');
    const anonimy = interaction.options.getString('anonimowe');
    const embed = new EmbedBuilder()
      .setColor('#F5A623')
      .setDescription(
        `Kanał <#${chanell}> został ustawiony jako kanał weryfikacyjny anonimów.\n Kanał <#${anonimy}> został ustawiony jako kanał zatwierdzonych anonimów`,
      )
      .setFooter({
        text: 'Anonimowe wiadomości',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });
    Anony.findOne(
      {
        guildId: interaction.guild.id,
      },
      async (err, data) => {
        if (data) data.delete();
        new Anony({
          guildId: interaction.guild.id,
          adminchannelid: chanell,
          anonwebhook: webhok,
          anonimchannel: anonimy,
        }).save();
        interaction.reply({
          embeds: [embed],
        });
      },
    );
  },
};
