const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');

module.exports = {
  name: 'topka',
  description: 'Ekonomia/aktywność',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'kategoria',
      type: ApplicationCommandOptionType.String,
      description: 'Wybierz kategorie',
      required: true,
      choices: [
        {
          name: '💰 Jaścoiny',
          value: 'jascoin',
          type: 1,
        },
        {
          name: '📝 Wiadomości',
          value: 'messages',
          type: 1,
        },
        {
          name: '🎤 Kanały głosowe',
          value: 'voicechannel',
          type: 1,
        },
        {
          name: `💫 Punkty XP`,
          value: 'xp',
          type: 1,
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
    await interaction.deferReply();

    const choice = interaction.options.getString('kategoria');
    const data = await db.find({ Guildid: interaction.guild.id });
    const settings = await guildSettings.findOne({
      GuildId: interaction.guild.id,
    });
    if (data) {
      if (choice === 'jascoin') {
        const moneysum = data
          .filter((x) => x.Money)
          .map((x) => x.Money)
          .reduce((sum, a) => sum + a, 0);

        const embed = new EmbedBuilder()
          .setAuthor({ name: `TOP #15 | JAŚCOINY` })
          .setColor('#FFFFFF')
          .setFooter({
            text: `Ilość osób w bazie: ${data.length} | Kasy na serwerze: ${moneysum.toFixed(2)}`,
          });

        await data
          .filter((x) => x.Money)
          .sort((a, b) => b.Money - a.Money)
          .slice(0, 10)
          .map((x, i) =>
            embed.addFields({
              name: `#${i + 1} ${x.Membertag}`,
              value: `${emoji.peepoGladHat} <@${x.Memberid}> ${emoji.jascoin} \`${x.Money.toFixed(2)}\` ${
                emoji.XP
              } \`${(x.Voicecount * 60 * settings.ecoVCxp + x.Messagescount * settings.ecoMSGxp).toFixed()}\` ${
                emoji.NOTE
              } \`${x.Messagescount}\` ${emoji.KARAOKE} \`${x.Voicecount.toFixed(2)}\` ❤ \`${x.XPupvote}\``,
              inline: false,
            }),
          );
        await interaction.followUp({ embeds: [embed] });
      }

      if (choice === 'messages') {
        const messsum = data
          .filter((x) => x.Messagescount)
          .map((x) => x.Messagescount)
          .reduce((sum, a) => sum + a, 0);

        const embed = new EmbedBuilder()
          .setTitle(`TOP #15 | WIADOMOŚCI`)
          .setColor('#FFFFFF')
          .setFooter({
            text: `Ilość osób w bazie: ${data.length} | Wiadomości na serwerze: ${messsum}`,
          });

        await data
          .filter((x) => x.Messagescount)
          .sort((a, b) => b.Messagescount - a.Messagescount)
          .slice(0, 10)
          .map((x, i) =>
            embed.addFields({
              name: `#${i + 1} ${x.Membertag}`,
              value: `${emoji.peepoGladHat} <@${x.Memberid}> ${emoji.NOTE} \`${x.Messagescount}\` ${
                emoji.jascoin
              } \`${x.Money.toFixed(2)}\` ${emoji.XP} \`${(
                x.Voicecount * 60 * settings.ecoVCxp +
                x.Messagescount * settings.ecoMSGxp
              ).toFixed()}\` ${emoji.KARAOKE} \`${x.Voicecount.toFixed(2)}\` ❤ \`${x.XPupvote}\``,
              inline: false,
            }),
          );
        await interaction.followUp({ embeds: [embed] });
      }

      if (choice === 'voicechannel') {
        const vcsum = data
          .filter((x) => x.Voicecount)
          .map((x) => x.Voicecount)
          .reduce((sum, a) => sum + a, 0);

        const embed = new EmbedBuilder()
          .setTitle(`TOP #15 osób | KANAŁY GŁOSOWE`)
          .setColor('#FFFFFF')
          .setFooter({
            text: `Ilość osób w bazie: ${data.length} | VC na serwerze: ${vcsum.toFixed(2)}`,
          });

        await data
          .filter((x) => x.Voicecount)
          .sort((a, b) => b.Voicecount - a.Voicecount)
          .slice(0, 10)
          .map((x, i) =>
            embed.addFields({
              name: `#${i + 1} ${x.Membertag}`,
              value: `${emoji.peepoGladHat} <@${x.Memberid}> ${emoji.KARAOKE} \`${x.Voicecount.toFixed(2)}\` ${
                emoji.jascoin
              } \`${x.Money.toFixed(2)}\` ${emoji.XP} \`${(
                x.Voicecount * 60 * settings.ecoVCxp +
                x.Messagescount * settings.ecoMSGxp
              ).toFixed()}\` ${emoji.NOTE} \`${x.Messagescount}\` ❤ \`${x.XPupvote}\``,
              inline: false,
            }),
          );
        await interaction.followUp({ embeds: [embed] });
      }
      if (choice === 'xp') {
        const xpsum = data
          .map((x) => x.Voicecount * 60 * settings.ecoVCxp + x.Messagescount * settings.ecoMSGxp)
          .reduce((sum, a) => sum + a, 0);

        const embed = new EmbedBuilder()
          .setAuthor({ name: `TOP #15 osób | PUNKTY XP` })
          .setColor('#FFFFFF')
          .setFooter({
            text: `Ilość osób w bazie: ${data.length} | XP na serwerze: ${xpsum.toFixed()}`,
          });

        await data
          .filter((x) => x.Guildid === interaction.guild.id)
          .sort(
            (a, b) =>
              b.Voicecount * 60 * settings.ecoVCxp +
              b.Messagescount * settings.ecoMSGxp -
              (a.Voicecount * 60 * settings.ecoVCxp + a.Messagescount * settings.ecoMSGxp),
          )
          .slice(0, 10)
          .map((x, i) =>
            embed.addFields({
              name: `#${i + 1} ${x.Membertag}`,
              value: `${emoji.peepoGladHat} <@${x.Memberid}> ${emoji.XP} \`${(
                x.Voicecount * 60 * settings.ecoVCxp +
                x.Messagescount * settings.ecoMSGxp
              ).toFixed()}\` ${emoji.KARAOKE} \`${x.Voicecount.toFixed(2)}\` ${emoji.jascoin} \`${x.Money.toFixed(
                2,
              )}\` ${emoji.NOTE} \`${x.Messagescount}\` ❤ \`${x.XPupvote}\``,
              inline: false,
            }),
          );
        await interaction.followUp({ embeds: [embed] });
      }
    }
  },
};
