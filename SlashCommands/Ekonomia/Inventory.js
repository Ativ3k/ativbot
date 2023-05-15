const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const db = require('../../Models/Eco');

module.exports = {
  name: 'inventory',
  description: 'ekonomiatest',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {Message} message

     * @raturns
    */

  run: async (client, interaction) => {
    const data = await db.findOne({
      Guildid: interaction.guild.id,
      Memberid: interaction.member.id,
    });
    if (!data) {
      return interaction.reply({ content: `Error!`, ephemeral: true });
    }
    const embed = new EmbedBuilder()
      .setDescription(
        `**Twoje przedmioty:**\n\n${
          data.Inventory.map((x, i) => `**${i + 1}.** ${x}`)
            .sort()
            .join(', \n') || `Pusto!:(`
        }`,
      )
      .setThumbnail(interaction.member.displayAvatarURL({ format: 'jpg', size: 1024 }))
      .setColor('Random');
    return interaction.reply({ embeds: [embed] });
  },
};
