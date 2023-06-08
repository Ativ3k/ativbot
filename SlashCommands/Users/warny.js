const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const warnSchema = require('../../Models/warndb');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'warny',
  description: 'Informacje o warnach.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'user',
      description: 'Wybierz użytkownika.',
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');

    if (!member) {
      const yourself = await warnSchema.find({
        GuildID: interaction.guild.id,
        MemberID: interaction.member.id,
      });

      const wazne = await yourself
        .filter((x) => x.Timeleft > Date.now())
        .sort((a, b) => b.Time - a.Time)
        .slice(0, 25)
        .map(
          (x) =>
            `${emoji.TAK} **ID:** ||\`${x._id}\`||, **Kiedy:** <t:${(x.Time / 1000).toFixed()}:R>,\n` +
            `**Przez:**<@${x.ModID}>\n` +
            `**Kończy się:** <t:${(x.Timeleft / 1000).toFixed()}:R>, **Punkty:** ${x.Punkty}\n` +
            `**Powód:** ${x.Reason}`,
        )
        .join('\n');
      const waznesum = yourself.filter((x) => x.Timeleft > Date.now()).length;

      const niewazne = await yourself
        .filter((x) => x.Timeleft < Date.now())
        .sort((a, b) => b.Time - a.Time)
        .slice(0, 25)
        .map(
          (x) =>
            `${emoji.NIE} **ID:** ||\`${x._id}\`||, **Kiedy:** <t:${(x.Time / 1000).toFixed()}:R>,\n` +
            `**Przez:**<@${x.ModID}> \n` +
            `**Kończy się:** <t:${(x.Timeleft / 1000).toFixed()}:R>, **Punkty:** ${x.Punkty}\n` +
            `**Powód:** ${x.Reason}`,
        )
        .join('\n');
      const niewaznesum = yourself.filter((x) => x.Timeleft < Date.now()).length;

      const punkty = yourself
        .filter((x) => x.Punkty && x.Timeleft > Date.now())
        .map((x) => x.Punkty)
        .reduce((sum, a) => sum + a, 0);
      const totalpkt = yourself
        .filter((x) => x.Punkty)
        .map((x) => x.Punkty)
        .reduce((sum, a) => sum + a, 0);

      const lista = `Aktywne:\n${wazne}\nNieaktywne:\n${niewazne}`;
      const embed = new EmbedBuilder()
        .setTitle(`Lista warnów ${interaction.user.username}`)
        .setColor('#FFFFFF')
        .setDescription(`${lista || `Brak`}`)
        .setFooter({
          text: `Aktywne: ${waznesum} | Nieaktywne: ${niewaznesum} | Punktów: ${punkty} (${totalpkt})`,
        });
      await interaction.reply({ embeds: [embed] });
    }
    if (member) {
      const data = await warnSchema.find({
        GuildID: interaction.guild.id,
        MemberID: user.id,
      });
      if (data) {
        const wazne = await data
          .filter((x) => x.Timeleft > Date.now())
          .sort((a, b) => b.Time - a.Time)
          .slice(0, 25)
          .map(
            (x) =>
              `**ID:** ||\`${x._id}\`||,\n` +
              `**Kiedy:** <t:${(x.Time / 1000).toFixed()}:R>,\n` +
              `**Kończy się:** <t:${(x.Timeleft / 1000).toFixed()}:R>,\n` +
              `**Przez:**<@${x.ModID}>\n` +
              `**Punkty:** ${x.Punkty}\n` +
              `**Powód:** ${x.Reason}\n`,
          )
          .join('\n');
        const waznesum = data.filter((x) => x.Timeleft > Date.now()).length;

        const niewazne = await data
          .filter((x) => x.Timeleft < Date.now())
          .sort((a, b) => b.Time - a.Time)
          .slice(0, 25)
          .map(
            (x) =>
              `**ID:** ||\`${x._id}\`||,\n` +
              `**Kiedy:** <t:${(x.Time / 1000).toFixed()}:R>, **Koniec:** <t:${(x.Timeleft / 1000).toFixed()}:R>,\n` +
              `**Przez:**<@${x.ModID}>\n` +
              `**Punkty:** ${x.Punkty}\n` +
              `**Powód:** ${x.Reason}\n`,
          )
          .join('\n');

        const niewaznesum = data.filter((x) => x.Timeleft < Date.now()).length;
        const punkty = data
          .filter((x) => x.Punkty && x.Timeleft > Date.now())
          .map((x) => x.Punkty)
          .reduce((sum, a) => sum + a, 0);
        const totalpkt = data
          .filter((x) => x.Punkty)
          .map((x) => x.Punkty)
          .reduce((sum, a) => sum + a, 0);

        const lista = `${emoji.TAK} **Aktywne:**\n${wazne || '-'}\n${emoji.NIE} **Nieaktywne:**\n${niewazne || '-'}`;
        const embed = new EmbedBuilder()
          .setTitle(`Lista warnów ${user.username}`)
          .setColor('#FFFFFF')
          .setDescription(`${lista || `Brak`}`)
          .setFooter({
            text: `Aktywne: ${waznesum} | Nieaktywne: ${niewaznesum} | Punktów: ${punkty} (${totalpkt})`,
          });
        await interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply({ content: `Nie znaleziono listy!` });
      }
    }
  },
};
