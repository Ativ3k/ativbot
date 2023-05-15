const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const guildSettings = require('../../Models/GuildSettings');

module.exports = {
  name: 'config',
  description: '(test) config command',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'voicelogschannel',
      description: 'Kanał do logów z vc',
      type: 1,
      options: [
        {
          name: 'channelvcl',
          description: 'Podaj kanał',
          type: 7,
          required: true,
        },
      ],
    },
    {
      name: 'check',
      description: 'checkconfig',
      type: 1,
    },
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */
  run: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();

    const data = await guildSettings.findOne({
      GuildId: interaction.guild.id,
    });
    if (!data) {
      await guildSettings
        .create({
          GuildId: interaction.guild.id,
          Debug: '0',
          ecoVC: '0',
          ecoMEM: '0',
          ecoMSG: '0',
          VoiceLog: '0',
          VoiceLogChannel: '0',
        })
        .save();
    }

    if (data) {
      if (subCommand === 'check') {
        const { GuildId } = data;
        const { VoiceLogChannel } = data;
        let Debug;
        let ecoVC;
        let ecoMEM;
        let ecoMSG;
        let VoiceLog;
        if (data.Debug === 1) {
          Debug = `${emoji.TAK} **Debug**`;
        } else {
          Debug = `${emoji.NIE} \`Debug\``;
        }
        if (data.ecoVC === 1) {
          ecoVC = `${emoji.TAK} **ecoVC**`;
        } else {
          ecoVC = `${emoji.NIE} \`ecoVC\``;
        }
        if (data.ecoMEM === 1) {
          ecoMEM = `${emoji.TAK} **ecoMEM**`;
        } else {
          ecoMEM = `${emoji.NIE} \`ecoMEM\``;
        }
        if (data.ecoMSG === 1) {
          ecoMSG = `${emoji.TAK} **ecoMSG**`;
        } else {
          ecoMSG = `${emoji.NIE} \`ecoMSG\``;
        }
        if (data.VoiceLog === 1) {
          VoiceLog = `${emoji.TAK} **VoiceLog** <#${VoiceLogChannel}>`;
        } else {
          VoiceLog = `${emoji.NIE} \`VoiceLog\``;
        }

        const embed = new EmbedBuilder()
          .setColor('Random')
          .setDescription(
            `**Informacje o ustawieniach:**\n🏠 **GuildId:** ${GuildId}\n${Debug}\n${ecoVC}\n${ecoMEM}\n${ecoMSG}\n${VoiceLog}`,
          );
        interaction.reply({ embeds: [embed] });
      }
      if (subCommand === 'voicelogschannel') {
        const vc = interaction.options.getChannel('channelvcl');
        await guildSettings.updateOne({ VoiceLogChannel: vc.id });
        interaction.reply({
          content: `Pomyślnie zmieniono **\`${subCommand}\`** na ${vc}`,
        });
      }
    }
  },
};
