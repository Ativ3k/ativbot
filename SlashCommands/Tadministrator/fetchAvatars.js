const { EmbedBuilder, ApplicationCommandType, CommandInteraction, Client } = require('discord.js');
const Eco = require('../../Models/Eco');

module.exports = {
  name: 'fetchavatars',
  description: 'test.',
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
    const data = await Eco.find({ Guildid: interaction.guild.id });
    data.map(async (x, i) => {
      const user = client.users.cache.get(x.Memberid);
      i++;
      if (user) {
        const findusr = await Eco.findOne({ Memberid: user.id });
        console.log(
          user.displayAvatarURL({
            format: 'png',
            size: 4096,
          }),
          i,
        );
        await findusr.updateOne({
          AvatarUrl: user.displayAvatarURL({
            format: 'png',
            size: 4096,
          }),
        });
      }
      return 0;
    });
  },
};
