const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const db = require('../../Models/Shop');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'debugshop',
  description: 'shop manage',
  defaultMemberPermissions: 'KickMembers',
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
    const data = await db.findOne({ Guildid: interaction.guild.id });
    if (!data) {
      await db
        .create({
          Guildid: interaction.guild.id,
          item1name: 'A',
          item1price: 1,
          item2name: 'B',
          item2price: 1,
          item3name: 'C',
          item3price: 1,
          item4name: 'D',
          item4price: 1,
          item5name: 'E',
          item5price: 1,
          item6name: 'F',
          item6price: 1,
          item7name: 'G',
          item7price: 1,
          item8name: 'H',
          item8price: 1,
          item9name: 'I',
          item9price: 1,
        })
        .save();
      interaction.reply({
        content: `Nie znaleziono bazy! Stworzoną nową`,
        ephemeral: true,
      });
    }
    if (data) {
      const item1 = `**#1** ${data.item1name}, ${data.item1price} ${emoji.jascoin}`;
      const item2 = `**#2** ${data.item2name}, ${data.item2price} ${emoji.jascoin}`;
      const item3 = `**#3** ${data.item3name}, ${data.item3price} ${emoji.jascoin}`;
      const item4 = `**#4** ${data.item4name}, ${data.item4price} ${emoji.jascoin}`;
      const item5 = `**#5** ${data.item5name}, ${data.item5price} ${emoji.jascoin}`;
      const item6 = `**#6** ${data.item6name}, ${data.item6price} ${emoji.jascoin}`;
      const item7 = `**#7** ${data.item7name}, ${data.item7price} ${emoji.jascoin}`;
      const item8 = `**#8** ${data.item8name}, ${data.item8price} ${emoji.jascoin}`;
      const item9 = `**#9** ${data.item9name}, ${data.item9price} ${emoji.jascoin}`;

      const embed = new EmbedBuilder()
        .setDescription(`${item1}\n${item2}\n${item3}\n${item4}\n${item5}\n${item6}\n${item7}\n${item8}\n${item9}`)
        .setColor('Random');

      interaction.reply({ embeds: [embed] });
    }
  },
};
