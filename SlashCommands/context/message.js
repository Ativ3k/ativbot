const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const emoji = require('../../json/emoji.json');
const reportChannel = require('../../Models/report');

module.exports = {
  name: 'Zgłoś wiadomość',
  type: 3,
  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const msg = interaction.options.getMessage('message');
    const reportConfig = await reportChannel.findOne({ guildId: interaction.guild.id });
    const report = client.channels.cache.get(reportConfig.reportchannel);

    const attachment = msg.attachments.first();
    const url = attachment ? attachment.url : null;

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

    const SUCCES = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Treść:')
      .setAuthor({
        name: `${interaction.member.displayName} (${interaction.user.id})`,
      })
      .setColor('Green')
      .setTitle('Kliknij aby przejść do wiadomości')
      .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msg.id}`)
      .setDescription(
        `**${emoji.GLADHAT} Autor:${msg.author} (${msg.author.id})\n${emoji.NOTE} Treść:**\n${msg.content}`,
      )
      .setImage(url)
      .setTimestamp()
      .setFooter({
        text: 'Zgłoszenie wiadomości',
        iconURL: 'https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless',
      });

    const REPORT = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Treść:')
      .setAuthor({
        name: `${interaction.member.displayName} (${interaction.user.id})`,
      })
      .setColor('Red')
      .setTitle('Kliknij aby przejść do wiadomości')
      .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msg.id}`)
      .setDescription(
        `**${emoji.GLADHAT} Autor:${msg.author} (${msg.author.id})\n${emoji.NOTE} Treść:**\n${msg.content}`,
      )
      .setImage(url)
      .setTimestamp()
      .setFooter({
        text: 'Zgłoszenie wiadomości',
        iconURL: 'https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless',
      });

    report.send({
      content: '(<@&871190767098540032>)',
      embeds: [REPORT],
      components: [buttons],
    });
    interaction.reply({
      content: `${emoji.SUCCESS} Pomyślnie wysłano zgłoszenie!`,
      embeds: [SUCCES],
      ephemeral: true,
    });
  },
};
