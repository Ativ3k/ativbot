const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  SelectMenuBuilder,
} = require('discord.js');

const emoji = require('../../json/emoji.json');
const mecze = require('../../Models/MECZE');
const Eco = require('../../Models/Eco');
const MECZE = require('../../Models/MECZE');
const kuponMECZE = require('../../Models/kuponMECZE');

module.exports = {
  name: `kupon`,
  description: 'Kupony, zakłady, bety.',
  dm_permission: 0,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'bet',
      description: 'Obstawianie dostępych meczy',
      type: 1,
      options: [
        {
          name: 'jascoiny',
          description: 'Ile coinów chcesz obstawić?',
          type: 10,
          required: true,
        },
      ],
    },
    {
      name: 'matchlist',
      description: 'Lista meczy.',
      type: 1,
      options: [
        {
          name: 'typ',
          description: 'Zakończone.',
          type: 3,
          required: false,
          choices: [{ name: 'Zakończone', value: 'Zakończone', type: 3 }],
        },
      ],
    },
    {
      name: 'list',
      description: 'Lista kuponów.',
      type: 1,
    },
    {
      name: 'matchinfo',
      description: 'Podsumowanie meczu.',
      type: 1,
      options: [
        {
          name: 'matchid',
          type: ApplicationCommandOptionType.String,
          description: 'Podaj matchid.',
          required: true,
        },
      ],
    },
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */
  run: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === 'matchlist') {
      const typ = interaction.options.getString('typ');
      const data = await MECZE.find({ GuildID: interaction.guild.id });
      if (typ === 'Zakończone') {
        const embed = new EmbedBuilder().setTitle('Lista meczy');
        if (data) {
          const wazne = await data
            .filter((x) => x.CzasStartu < Date.now())
            .sort((a, b) => b.CzasStartu - a.CzasStartu)
            .slice(0, 10)
            .map(
              (x) =>
                `⚽ ${x.Druzyna1} **VS** ${x.Druzyna2} | ${x.Status || `${emoji.MINUS}`} | ${
                  x.Winner || `${emoji.MINUS}`
                }\n` +
                `${emoji.NOTE} **ID:** ||${x._id}||\n` +
                `${emoji.TIME} **Czas:** <t:${Number(x.CzasStartu / 1000).toFixed()}:R>\n`,
            )
            .join('\n');

          if (wazne.length >= 1) {
            embed.setDescription(
              `${emoji.TAK} - nagrody wypłacone\n${emoji.MINUS} - nagrody w trakcie wypłącania\n:warning: - mecz anulowany\n\n${wazne}`,
            );
            await interaction.reply({ embeds: [embed] });
          } else {
            embed.setDescription(`Brak zakończonych meczy!`);
            await interaction.reply({ embeds: [embed] });
          }
        }
      } else {
        const embed = new EmbedBuilder().setTitle('Lista meczy');
        if (data) {
          const wazne = await data
            .filter((x) => x.CzasStartu > Date.now())
            .sort((a, b) => a.CzasStartu - b.CzasStartu)
            .slice(0, 20)
            .map(
              (x, i) =>
                `#${i + 1} ⚽ ${x.Druzyna1} **VS** ${x.Druzyna2} (${x.ifT1win}x - ${x.ifDRAW}x - ${x.ifT2win}x)\n` +
                `${emoji.NOTE} **ID:** ||${x._id}||\n${emoji.TIME} **Czas:** <t:${Number(
                  x.CzasStartu / 1000,
                ).toFixed()}:R>\n`,
            )
            .join('\n');

          if (wazne.length >= 1) {
            embed.setDescription(`${wazne}`);
            await interaction.reply({ embeds: [embed] });
          } else {
            embed.setDescription(`Brak aktywnych meczy!`);
            await interaction.reply({ embeds: [embed] });
          }
        }
      }
    }
    if (subCommand === 'list') {
      const data = await kuponMECZE.find({
        GuildID: interaction.guild.id,
        MemberID: interaction.member.id,
      });
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Kupony | ${interaction.member.user.username}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle('Lista kuponów');
      if (data.length === 0) {
        embed.setDescription(`Brak kuponów!`);
        await interaction.reply({ embeds: [embed] });
      }
      if (data.length >= 1) {
        await data
          .filter((x) => x.Time < Date.now())
          .sort((a, b) => b.Time - a.Time)
          .slice(0, 25)
          .map((x) =>
            embed.addFields({
              name: `${x.Druzyna1} **VS** ${x.Druzyna2} ${x.Status}`,
              value: `ID: ||${x.idmeczu}||\nNa: **${x.Winner.replace('remis', 'Remis')
                .replace('druzyna1', `${x.Druzyna1}`)
                .replace('druzyna2', `${x.Druzyna2}`)}** = ${x.BetValue} ${emoji.jascoin} <t:${Number(
                x.Time / 1000,
              ).toFixed()}:R>`,
            }),
          );

        const wygrane = await data
          .filter((x) => x.Status === '<:tak:1020115278920691773>' && x.Confirmed === true)
          .sort((a, b) => b.Time - a.Time)
          .map((x) => x.BetValue * (x.Multipler - 1))
          .reduce((sum, a) => sum + a, 0);
        const wygranesize = await data.filter((x) => x.Status === '<:tak:1020115278920691773>' && x.Confirmed === true);

        const przegrane = await data
          .filter((x) => x.Status === '<:nie:1020115284549451786>' && x.Confirmed === true)
          .sort((a, b) => b.Time - a.Time)
          .map((x) => x.BetValue)
          .reduce((sum, a) => sum + a, 0);
        const przegranesize = await data.filter(
          (x) => x.Status === '<:nie:1020115284549451786>' && x.Confirmed === true,
        );

        await embed.setDescription(
          `${emoji.TAK}** - Wygrana (W:${wygranesize.length} - ${wygrane.toFixed()}${emoji.jascoin})\n` +
            `${emoji.NIE} - przegrana (P:${przegranesize.length} - ${przegrane.toFixed()}${emoji.jascoin})\n` +
            `${emoji.MINUS} - w trakcie\n:warning: - mecz anulowany**\n` +
            `**Bilans:** \`${(wygrane - przegrane).toFixed(2)}\` ${emoji.jascoin}`,
        );
        await interaction.reply({ embeds: [embed] });
      }
    }
    if (subCommand === 'matchinfo') {
      const matchid = interaction.options.getString('matchid');
      const { ObjectId } = require('mongodb');
      const objId = new ObjectId(matchid);
      const MECZ = await mecze.findOne({ _id: objId });

      const embed = new EmbedBuilder()
        .setTitle(`${MECZ.Druzyna1} vs ${MECZ.Druzyna2} (${MECZ.ifT1win}x - ${MECZ.ifDRAW}x - ${MECZ.ifT2win})`)
        .setDescription(`Wybierz typ:`)
        .setColor('#5555ff')
        .setFooter({ text: `${matchid}` });

      const wybór = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('matchinfo-team1').setLabel(`${MECZ.Druzyna1}`).setStyle('Success'),
        )
        .addComponents(new ButtonBuilder().setCustomId('matchinfo-draw').setLabel(`Remis`).setStyle('Success'))
        .addComponents(
          new ButtonBuilder().setCustomId('matchinfo-team2').setLabel(`${MECZ.Druzyna2}`).setStyle('Success'),
        );

      const timeout = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('matchinfo-team1')
            .setLabel(`${MECZ.Druzyna1}`)
            .setStyle('Danger')
            .setDisabled(true),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('matchinfo-draw').setLabel(`Remis`).setStyle('Danger').setDisabled(true),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('matchinfo-team2')
            .setLabel(`${MECZ.Druzyna2}`)
            .setStyle('Danger')
            .setDisabled(true),
        );

      const msgreply = await interaction.reply({
        embeds: [embed],
        components: [wybór],
        fetchReply: true,
      });

      setTimeout(() => {
        msgreply.edit({ components: [timeout] });
      }, 60000);
    }
    if (subCommand === 'bet') {
      const betvalue = interaction.options.getNumber('jascoiny');
      const ecodata = await Eco.findOne({
        Guildid: interaction.guild.id,
        Memberid: interaction.member.id,
      });
      if (!ecodata)
        return interaction.reply({
          content: `Error, brak danych o członku!\nAby stworzyć profil członka spełnij jakikolwiek warunek wyjaśniony w </ecohelp:1023094862695903242>.`,
        });
      if (ecodata.Money < betvalue)
        return interaction.reply({
          content: `Nie masz wystarczająco ${emoji.jascoin} aby obstawić **${betvalue}**!`,
          ephemeral: true,
        });
      const data = await mecze.find({ GuildID: interaction.guild.id });

      const matchlist = new SelectMenuBuilder().setCustomId('matchlist').setPlaceholder(`Lista meczy`);

      const output = await data
        .filter((x) => x.CzasStartu > Date.now())
        .sort((a, b) => a.CzasStartu - b.CzasStartu)
        .slice(0, 25)
        .map(
          (x) =>
            `${x}` &&
            matchlist.addOptions({
              label: `(D1) ${x.Druzyna1} - (D2) ${x.Druzyna2} | (${x.ifT1win || '?'}x - ${x.ifDRAW || '?'}x - ${
                x.ifT2win || '?'
              }x)`,
              value: `${x._id}`,
            }),
        );

      if (output.length === 0) return interaction.reply({ content: `Brak aktywnych meczy!` });

      const selectmatch = new ActionRowBuilder().addComponents(matchlist);

      const whowin = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('betto')
          .setPlaceholder(`Kto wygra?`)
          .addOptions([
            { label: `Druzyna 1 (D1)`, value: `druzyna1` },
            { label: `Remis`, value: `remis` },
            { label: `Druzyna 2 (D2)`, value: `druzyna2` },
          ]),
      );

      const coins = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('betcoins')
          .setPlaceholder(`${betvalue}`)
          .addOptions([{ label: `${betvalue} coinów`, value: `${betvalue}` }]),
      );

      const confirmbutton = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('acceptbet')
            .setLabel('Akceptuj')
            .setStyle('Success')
            .setEmoji(`${emoji.SUCCESS}`),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('denybet').setLabel('Odrzuć').setStyle('Danger').setEmoji(`${emoji.FAILURE}`),
        );

      await interaction.reply({
        content: `Obstawiasz ${betvalue} ${emoji.jascoin} na:`,
        components: [selectmatch, whowin, coins, confirmbutton],
        ephemeral: true,
      });
    }
    return 0;
  },
};
