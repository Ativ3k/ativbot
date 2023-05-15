const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const guildSettings = require('../../Models/GuildSettings');

module.exports = {
  name: 'modul',
  description: 'Ustawienia modułów.',
  dm_permission: 0,
  userPermissions: 'KickMembers',
  defaultMemberPermissions: 'KickMembers',
  options: [
    {
      name: 'modul',
      type: ApplicationCommandOptionType.String,
      description: 'Wybierz moduł',
      required: true,
      choices: [
        {
          name: 'Debug',
          value: 'Debug',
        },
        {
          name: 'Ekonomia Message',
          value: 'Ekonomia Message',
        },
        {
          name: 'Ekonomia VoiceChat',
          value: 'Ekonomia VoiceChat',
        },
        {
          name: 'Ekonomia Memiki',
          value: 'Ekonomia Memiki',
        },
        {
          name: 'Voice Logs',
          value: 'Voice Logs',
        },
      ],
    },
    {
      name: 'toggle',
      type: ApplicationCommandOptionType.String,
      description: 'Włącz/wyłącz',
      required: true,
      choices: [
        {
          name: 'Włącz',
          value: '1',
        },
        {
          name: 'Wyłącz',
          value: '0',
        },
      ],
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
    const choice = interaction.options.getString('modul');
    const setting = interaction.options.getString('toggle');
    const data = await guildSettings.findOne({
      GuildId: interaction.guild.id,
    });
    if (!data) {
      await guildSettings
        .create({
          GuildId: interaction.guild.id,
        })
        .save();
      await interaction.reply({
        content: `Zdaje się że ten serwer nie ma profilu ustawień...\nUtworzono nowy profil ustawień!`,
      });
    }
    if (data) {
      if (choice === 'Debug') {
        await data.updateOne({ Debug: setting });
        const embed = new EmbedBuilder()
          .setColor('Random')
          .setDescription(`Zaktualizowano ustawienie modułu **\`${choice}\`** na **\`${setting}\`**`);
        interaction.reply({ embeds: [embed] });
      }
      if (choice === 'Ekonomia Message') {
        await data.updateOne({ ecoMSG: setting });
        const embed = new EmbedBuilder()
          .setColor('Random')
          .setDescription(`Zaktualizowano ustawienie modułu **\`${choice}\`** na **\`${setting}\`**`);
        interaction.reply({ embeds: [embed] });
      }
      if (choice === 'Ekonomia VoiceChat') {
        await data.updateOne({ ecoVC: setting });
        const embed = new EmbedBuilder()
          .setColor('Random')
          .setDescription(`Zaktualizowano ustawienie modułu **\`${choice}\`** na **\`${setting}\`**`);
        interaction.reply({ embeds: [embed] });
      }
      if (choice === 'Ekonomia Memiki') {
        await data.updateOne({ ecoMEM: setting });
        const embed = new EmbedBuilder()
          .setColor('Random')
          .setDescription(`Zaktualizowano ustawienie modułu **\`${choice}\`** na **\`${setting}\`**`);
        interaction.reply({ embeds: [embed] });
      }
      if (choice === 'Voice Logs') {
        await data.updateOne({ VoiceLog: setting });
        const checkvc = data.VoiceLogChannel;
        let info;
        if (checkvc === 0) {
          info = `Nie ma ustalonego kanału logów!`;
        }
        if (checkvc > 1) {
          info = `Kanał VCL: <#${checkvc}>`;
        }
        const embed = new EmbedBuilder()
          .setColor('Random')
          .setDescription(`Zaktualizowano ustawienie modułu **\`${choice}\`** na **\`${setting}\`**\n${info}`);
        interaction.reply({ embeds: [embed] });
      }
    }
  },
};
