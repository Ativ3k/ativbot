const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const KaraokeDB = require('../../Models/KaraokeSchema');

module.exports = {
  name: 'karaokestatus',
  description: 'Sprawdź status karaoke',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'nrkaraoke',
      description: 'Number',
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction) => {
    const nrkaraoke = interaction.options.getNumber('nrkaraoke');

    if (nrkaraoke === 1) {
      const embed = new EmbedBuilder()
        .setDescription(
          `Dane są niekompletne!\n` +
            `**__Miejsce = Kto = Exp__**\n` +
            `🥇<@525644217654181919> - **\`60K\`**\n` +
            `🥈<@385159306481238016> - **\`40K\`**\n` +
            `🥉<@238730736008560641> - **\`20K\`**\n` +
            `**4-5#** <@394096902678773760>, <@853287567193800704>, <@672541884266184718> - **\`10K\`**`,
        )
        .setColor('#303236')
        .setFooter({
          text: `Wyniki karaoke nr: ${nrkaraoke}`,
          iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
        });
      return interaction.reply({ embeds: [embed] });
    }
    if (nrkaraoke === 2) {
      const embed = new EmbedBuilder()
        .setDescription(
          `Dane są niekompletne!\n` +
            `**__Miejsce = Kto = Exp__**\n` +
            `🥇<@525644217654181919> - **\`71.4K\`**\n` +
            `🥈<@287300871799439362> - **\`50.6K\`**\n` +
            `🥉<@385159306481238016> - **\`30.3K\`**\n` +
            `**4#** <@898590375583809567> - **\`20K\`** \n` +
            `**5#** <@361243689034448896> - **\`18.2K\`** `,
        )
        .setColor('#303236')
        .setFooter({
          text: `Wyniki karaoke nr: ${nrkaraoke}`,
          iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
        });
      return interaction.reply({ embeds: [embed] });
    }

    const datacheck = await KaraokeDB.findOne({ karaokeID: nrkaraoke });
    if (!datacheck) return interaction.reply(`Brak danych o karaoke nr **${nrkaraoke}**`);
    const data = await KaraokeDB.find({ karaokeID: nrkaraoke });
    if (data) {
      const output = data
        .filter((x) => x.total)
        .sort((a, b) => b.total - a.total)
        .map((x) => `<@${x.userid}> - **${x.total}**`);

      const embed = new EmbedBuilder()
        .setDescription(
          `🥇${output.at(0) || 'Brak'}\n` +
            `🥈${output.at(1) || 'Brak'}\n` +
            `🥉${output.at(2) || 'Brak'}\n` +
            `**4#** ${output.at(3) || 'Brak'}\n` +
            `**5#** ${output.at(4) || 'Brak'}\n` +
            `**6#** ${output.at(5) || 'Brak'}\n` +
            `**7#** ${output.at(6) || 'Brak'}\n` +
            `**8#** ${output.at(7) || 'Brak'}\n` +
            `**9#** ${output.at(8) || 'Brak'}\n` +
            `**10#** ${output.at(9) || 'Brak'}\n` +
            `**11#** ${output.at(10) || 'Brak'}\n` +
            `**12#** ${output.at(11) || 'Brak'}\n` +
            `**13#** ${output.at(12) || 'Brak'}\n` +
            `**14#** ${output.at(13) || 'Brak'}\n` +
            `**15#** ${output.at(14) || 'Brak'}`,
        )
        .setColor('#303236')
        .setFooter({
          text: `Wyniki karaoke nr: ${nrkaraoke}`,
          iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
        });
      interaction.reply({ embeds: [embed] });
    }
    return 0;
  },
};
