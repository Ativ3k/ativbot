const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  name: 'administracja',
  description: 'Aktualny skład administracji',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const channel = client.channels.cache.get('640496967168032778');
    channel.messages.fetch({ limit: 1 }).then((messages) => {
      const lastMessage = messages.first();
      const embed = new EmbedBuilder()
        .setColor('#55ff55')
        .setAuthor({
          name: 'Skład administracji.',
        })
        .setDescription(lastMessage.content)
        .setTimestamp()
        .setFooter({
          text: 'Administracja Wiemjak',
          iconURL: 'https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless',
        });

      if (!lastMessage.author.bot) {
        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    });
  },
};
