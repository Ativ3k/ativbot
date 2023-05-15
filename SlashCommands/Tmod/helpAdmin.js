const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  name: 'help-admin',
  description: 'Komendy bota',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const commandslist = client.application.commands.cache
      .filter((x) => x.defaultMemberPermissions && x.type === ApplicationCommandType.ChatInput)
      .map((x) => `**• </${x.name}:${x.id}>**\n`)
      .sort();

    const embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setDescription(commandslist.join(''))
      .setTitle(`Komendy WiemjakBOT`)
      .setFooter({ text: `Łacznie ${commandslist.length} komend.` });
    return interaction.reply({ embeds: [embed] });
  },
};
