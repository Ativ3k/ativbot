const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Informacje o użytkowniku',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'Wybierz użytkownika',
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
    const guild = client.guilds.cache.get(interaction.guild.id);
    const user = interaction.options.getUser('user');
    const member = guild.members.cache.get(user.id);
    const create = user.createdTimestamp / 1000;
    const join = member.joinedTimestamp / 1000;

    const roleList = member.roles.cache
      .filter((role) => role.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${user.username} - Info`)
      .setDescription(
        `<@${user.id}> (${user.id})\n` +
          `**Link do zdjęcia**: [Kliknij tutaj](${user.displayAvatarURL({
            format: 'png',
            size: 4096,
          })})\n\n` +
          `**Dołączył do discorda:** <t:${Number(create).toFixed(0)}:R>\n` +
          `**Dołączył do serwera:** <t:${Number(join).toFixed(0)}:R>\n\n` +
          `**Role:**\n ${roleList}`,
      )
      .setThumbnail(user.displayAvatarURL({ format: 'png', size: 4096 }));

    await interaction.reply({ embeds: [embed] });
  },
};
