const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

const db = require('../../Models/InviteTracker');

module.exports = {
  name: 'invitestats',
  description: 'Statystyki zaproszeń.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'page',
      description: 'Strona',
      type: 10,
      require: false,
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
    const page = interaction.options.getNumber('page');
    const data = await db.find({ GuildID: interaction.guild.id });

    let from;
    let to;
    let tonr;
    if (!page || page === 1) {
      from = 0;
      to = 25;
      tonr = 0;
    } else {
      from = 25 * page - 25;
      to = from + 25;
      tonr = 25 * page - 25;
    }

    const description = await data
      .filter((x) => x.Total)
      .sort((a, b) => b.Total.length - a.Total.length)
      .slice(from, to)
      .map((x, i) => `${tonr + i + 1} - <@${x.MemberID}> zaprosił **${x.Total.length}** osób`)
      .join('\n');

    let strona;
    strona = (data.length / 25).toFixed();
    if (!page || page === 1) {
      strona = 1;
    }
    // const totalpages = (data.length / 25).toString().match(/^-?\d+(?:\d{1,2})?/)[0]
    // const totalusage = data
    //   .filter((x) => x.Usage)
    //   .map((x) => x.Usage)
    //   .reduce((sum, a) => sum + a, 0);
    const embed = new EmbedBuilder()
      .setAuthor({ name: `TOP INVITE | ${page || '1'}/${strona}` })
      .setColor('#FFFFFF')
      .setDescription(`${description}`);

    await interaction.reply({ embeds: [embed] });
  },
};
