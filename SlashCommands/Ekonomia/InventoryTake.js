const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');

module.exports = {
  name: 'inventorytake',
  description: 'ekonomiatest',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'Wybierz użytkownika',
      required: true,
    },
    {
      name: 'numer',
      description: 'numer przedmiotu',
      type: 10,
      required: true,
    },
  ],

  /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {Message} message

     * @raturns
    */

  run: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const itemnumber = interaction.options.getNumber('numer');
    const data = await db.findOne({
      Guildid: interaction.guild.id,
      Memberid: user.id,
    });
    let embed;
    if (!data) {
      return interaction.reply({ content: `Error!`, ephemeral: true });
    }
    if (data) {
      const item = data.Inventory.at(itemnumber - 1)
        .replace('||', ``)
        .replace('||', ``);
      console.log(item);
      await data.updateOne({
        $pull: { Inventory: data.Inventory.at(itemnumber - 1) },
      });
      embed = new EmbedBuilder()
        .setDescription(`${emoji.TAK} Pomyślnie usunięto ||${item}|| z ekwipunku ${user}`)
        .setColor('Random');
    }
    return interaction.reply({ embeds: [embed] });
  },
};
