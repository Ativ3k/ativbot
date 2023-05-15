const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const Eco = require('../../Models/Eco');
const kuponMECZ = require('../../Models/kuponMECZE');
const mecze = require('../../Models/MECZE');

module.exports = {
  name: 'bukmacher',
  description: 'Zarządzanie meczami i wynikami.',
  defaultMemberPermissions: 'KickMembers',
  dm_permission: 0,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'addmatch',
      description: 'Dodaj mecz do bazy.',
      type: 1,
      options: [
        {
          name: 'd1',
          type: ApplicationCommandOptionType.String,
          description: 'Podaj drużyne pierwszą.',
          required: true,
        },
        {
          name: 'd2',
          type: ApplicationCommandOptionType.String,
          description: 'Podaj drużyne drugą.',
          required: true,
        },
        {
          name: 'czas-startu',
          type: ApplicationCommandOptionType.Number,
          description: 'Podaj czas rozpoczęcia meczu (timestamp)',
          required: true,
        },
        {
          name: 'd1kurs',
          type: ApplicationCommandOptionType.Number,
          description: 'Kurs jeżeli drużyna 1 wygra.',
          required: true,
        },
        {
          name: 'remiskurs',
          type: ApplicationCommandOptionType.Number,
          description: 'Kurs jeżeli drużyny zremisują.',
          required: true,
        },
        {
          name: 'd2kurs',
          type: ApplicationCommandOptionType.Number,
          description: 'Kurs jeżeli drużyna 2 wygra.',
          required: true,
        },
      ],
    },
    {
      name: 'matchlist',
      description: 'Lista zakończonych meczy.',
      type: 1,
    },
    {
      name: 'endmatch',
      description: 'Zakończ mecz.',
      type: 1,
      options: [
        {
          name: 'matchid',
          type: ApplicationCommandOptionType.String,
          description: 'Podaj matchid.',
          required: true,
        },
        {
          name: 'wygrana',
          type: ApplicationCommandOptionType.String,
          description: 'Podaj drużyne.',
          required: true,
          choices: [
            { name: 'Drużyna 1', value: 'druzyna1', type: 3 },
            { name: 'Remis', value: 'remis', type: 3 },
            { name: 'Drużyna 2', value: 'druzyna2', type: 3 },
            { name: 'Anuluj mecz', value: 'anuluj', type: 3 },
          ],
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
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === 'addmatch') {
      const druzyna1 = interaction.options.getString('d1');
      const druzyna2 = interaction.options.getString('d2');
      const czasstartu = interaction.options.getNumber('czas-startu');
      const d1kurs = interaction.options.getNumber('d1kurs');
      const d2kurs = interaction.options.getNumber('d2kurs');
      const remiskurs = interaction.options.getNumber('remiskurs');
      const data = await kuponMECZ.findOne({
        GuildID: interaction.guild.id,
        Druzyna1: druzyna1,
        Druzyna2: druzyna2,
        CzasStartu: czasstartu,
      });
      await interaction.deferReply();
      if (data) return interaction.followUp({ content: `Ten mecz już jest w bazie!` });
      if (!data) {
        await mecze
          .create({
            GuildID: interaction.guild.id,
            Druzyna1: druzyna1,
            Druzyna2: druzyna2,
            CzasStartu: czasstartu * 1000,
            Status: `${emoji.MINUS}`,
            ifT1win: d1kurs,
            ifT2win: d2kurs,
            ifDRAW: remiskurs,
          })
          .save();
        const matchinfo = await mecze.findOne({
          GuildID: interaction.guild.id,
          Druzyna1: druzyna1,
          Druzyna2: druzyna2,
          CzasStartu: czasstartu * 1000,
        });

        interaction.editReply({
          content: `${matchinfo._id}\nPomyślnie dodano mecz!\n ${druzyna1}:${druzyna2} - <t:${czasstartu.toFixed()}:R>`,
        });
      }
    }
    if (subCommand === 'matchlist') {
      const data = await mecze.find({ GuildID: interaction.guild.id });
      const embed = new EmbedBuilder().setTitle('Lista meczy');

      if (data) {
        const wazne = await data
          .filter((x) => x.CzasStartu < Date.now())
          .sort((a, b) => b.CzasStartu - a.CzasStartu)
          .slice(0, 10)
          .map(
            (x, i) =>
              `#${i + 1} ⚽ ${x.Druzyna1} **VS** ${x.Druzyna2}| ${x.Status || `${emoji.MINUS}`}\n${
                emoji.NOTE
              } **ID:** ||${x._id}||\n${emoji.TIME} **Czas:** <t:${Number(x.CzasStartu / 1000)}:R>\n`,
          )
          .join('\n');

        if (wazne.length >= 1) {
          embed.setDescription(`${wazne}`);
          await interaction.reply({ embeds: [embed] });
        } else {
          embed.setDescription(`Brak zakończonych meczy!`);
          await interaction.reply({ embeds: [embed] });
        }
      }
    }

    if (subCommand === 'endmatch') {
      const whowin = interaction.options.getString('wygrana');
      const matchid = interaction.options.getString('matchid');
      const { ObjectId } = require('mongodb');
      const objId = new ObjectId(matchid);
      const alldata = await kuponMECZ.find({
        GuildID: interaction.guild.id,
        idmeczu: matchid,
        Confirmed: true,
      });

      await interaction.deferReply();
      if (!alldata) return interaction.followUp({ content: `Nie znaleziono meczu!` });
      if (alldata) {
        if (whowin === 'anuluj') {
          await kuponMECZ.updateMany({ idmeczu: matchid }, { Status: `:warning:` });
          const data = await mecze.findOne({
            GuildID: interaction.guild.id,
            _id: objId,
          });
          await data.updateOne({ CzasStartu: Date.now(), Status: `:warning:` });
          await Promise.all(
            alldata
              .filter((x) => x.idmeczu === matchid)
              .map(async (x) => {
                await Eco.findOneAndUpdate(
                  { Guildid: interaction.guild.id, Memberid: x.MemberID },
                  { $inc: { Money: x.BetValue } },
                );
              }),
          );
          return interaction.followUp({
            content: `Zwrócono pieniądze z anulowanego meczu **${matchid}**.`,
          });
        }
        const data = await mecze.findOne({
          GuildID: interaction.guild.id,
          _id: objId,
        });

        await kuponMECZ.updateMany({ idmeczu: matchid }, { Status: `${emoji.NIE}` });
        await kuponMECZ.updateMany({ Winner: whowin, idmeczu: matchid }, { Status: `${emoji.TAK}` });
        let winteam;
        let multipler;
        if (whowin === 'druzyna1') {
          multipler = data.ifT1win;
          winteam = `🏆 ${data.Druzyna1} (x${multipler})`;
        }
        if (whowin === 'druzyna2') {
          multipler = data.ifT2win;
          winteam = `🏆 ${data.Druzyna2}(x${multipler})`;
        }
        if (whowin === 'remis') {
          multipler = data.ifDRAW;
          winteam = `🏆 Remis (x${multipler})`;
        }

        await data.updateOne({ Status: `${emoji.TAK}`, Winner: winteam });
        await Promise.all(
          alldata
            .filter((x) => x.Winner === whowin)
            .map(async (x) => {
              await Eco.findOneAndUpdate(
                { Guildid: interaction.guild.id, Memberid: x.MemberID },
                { $inc: { Money: x.BetValue * multipler } },
              );
            }),
        );

        const totalpaid = alldata
          .filter((x) => x.Winner === whowin)
          .map((x) => x.BetValue)
          .reduce((sum, a) => sum + a, 0);
        return interaction.followUp({
          content: `Wypłacono pieniądze dla wygranych z meczu **${matchid}**.\nŁącznie wypłacono: ${
            totalpaid.toFixed() * multipler
          } ${emoji.jascoin}.`,
        });
      }
    }
    return 0;
  },
};
