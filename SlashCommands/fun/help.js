const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Komendy bota',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const commandsList = client.application.commands.cache
      .filter((x) => !x.defaultMemberPermissions && !(x.type === 3))
      .map((x) => `**• </${x.name}:${x.id}>** = ${x.description}\n`)
      .sort();

    const embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setDescription(commandsList.join(''))
      .setTitle(`Komendy WiemjakBOT`)
      .setFooter({ text: `Łacznie ${commandsList.length} komend.` });
    return interaction.reply({ embeds: [embed] });
  },
};
