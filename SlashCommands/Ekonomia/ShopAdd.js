const { ApplicationCommandType } = require('discord.js');
const db = require('../../Models/Shop');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'shop',
  description: 'shop manage',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'set',
      description: 'Ustal przedmiot przedmiot',
      type: 1,
      options: [
        {
          name: 'przedmiot',
          description: 'wybierz przedmiot',
          type: 3,
          required: true,
          choices: [
            {
              name: 'Item 1',
              value: '1',
              type: 1,
            },
            {
              name: 'Item 2',
              value: '2',
              type: 1,
            },
            {
              name: 'Item 3',
              value: '3',
              type: 1,
            },
            {
              name: 'Item 4',
              value: '4',
              type: 1,
            },
            {
              name: 'Item 5',
              value: '5',
              type: 1,
            },
            {
              name: 'Item 6',
              value: '6',
              type: 1,
            },
            {
              name: 'Item 7',
              value: '7',
              type: 1,
            },
            {
              name: 'Item 8',
              value: '8',
              type: 1,
            },
            {
              name: 'Item 9',
              value: '9',
              type: 1,
            },
          ],
        },
        {
          name: 'cena',
          description: 'cena przedmiotu',
          type: 10,
          required: true,
        },
        {
          name: 'nazwa',
          description: 'nazwa przedmiotu',
          type: 3,
          required: true,
        },
      ],
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
    const item = interaction.options.getString('przedmiot');
    const price = interaction.options.getNumber('cena');
    const name = interaction.options.getString('nazwa');
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
        content: `Nie znaleziono bazy sklepu! Stworzoną nową.`,
        ephemeral: true,
      });
    }
    if (data) {
      if (item === '1') {
        await data.updateOne({ item1name: name, item1price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **1** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '2') {
        await data.updateOne({ item2name: name, item2price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **2** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '3') {
        await data.updateOne({ item3name: name, item3price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **3** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '4') {
        await data.updateOne({ item4name: name, item4price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **4** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '5') {
        await data.updateOne({ item5name: name, item5price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **5** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '6') {
        await data.updateOne({ item6name: name, item6price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **6** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '7') {
        await data.updateOne({ item7name: name, item7price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **7** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '8') {
        await data.updateOne({ item8name: name, item8price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **8** za cene **${price}**${emoji.jascoin}`,
        });
      }
      if (item === '9') {
        await data.updateOne({ item9name: name, item9price: price });
        interaction.reply({
          content: `Pomyślnie dodano **${name}** na miejsce nr **9** za cene **${price}**${emoji.jascoin}`,
        });
      }
    }
  },
};
