const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require('discord.js');

const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'admin-ticket-weryfikacja',
  description: 'Panel weryfikacyjny +18.',
  userPermissions: 'Administrator',
  defaultMemberPermissions: 'Administrator',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Weryfikacja +18.',
        iconURL: 'https://cdn.discordapp.com/emojis/968502676042170409.webp?size=96&quality=lossless',
        url: 'https://discord.gg/wiemjak',
      })
      .setColor('#FFB808')
      .setDescription('**`Kliknij poniżej aby utworzyć ticket w celu wysłania zdjęcia weryfikacyjnego.`**');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket-open')
        .setEmoji(`${emoji.CHANNEL}`)
        .setLabel('Otwórz ticket.')
        .setStyle('Secondary'),
    );

    interaction.reply({ content: 'Sukces!', ephemeral: true });
    interaction.channel.send({ embeds: [embed], components: [row] });
  },
};
