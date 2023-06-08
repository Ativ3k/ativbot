const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');

module.exports = {
  name: 'money',
  description: 'Zarządzanie porftelem członka.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  defaultMemberPermissions: 'KickMembers',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'Kto?',
      required: true,
    },
    {
      name: 'value',
      type: ApplicationCommandOptionType.Number,
      description: 'Ile coinów?',
      required: false,
    },
  ],

  /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {Message} message

     * @raturns
    */

  run: async (client, interaction) => {
    const value = interaction.options.getNumber('value');
    const target = interaction.options.getMember('user');
    const data = await db.findOne({ Guildid: interaction.guild.id, Memberid: target.id });
    const settings = await guildSettings.findOne({ GuildId: interaction.guild.id });
    let embed;

    await interaction.deferReply();

    if (!data) return interaction.followUp({ content: `Brak użytkownika w bazie!` });
    if (value) {
      await data.updateOne({ $inc: { Money: value } });
      return interaction.followUp({
        content: `Pomyślnie zmieniono stan konta o **${value}** ${emoji.jascoin} użytkownika ${target}.`,
      });
    }
    if (data) {
      let totalxp = 0;
      totalxp += data.Voicecount * 60 * settings.ecoVCxp + data.Messagescount * settings.ecoMSGxp;
      const levels = Array.from({ length: 200 }, (_, i) => (300 * (i + 1) * (i + 1)) / 2 - (i + 1) * 50 - 100);
      let nextlvl;
      let curlvlXP;
      let level;
      levels.forEach((v, i) => {
        if (totalxp >= v) {
          level = i + 1;
          nextlvl = 100 + level * 300;
          curlvlXP = v;
        }
      });
      const create = target.user.createdTimestamp / 1000;
      const join = target.joinedTimestamp / 1000;
      const sum = totalxp;
      const curlvlxp = (curlvlXP - sum) * -1;
      const percentage = `${((curlvlxp / nextlvl) * 100).toFixed(2)}%`;
      embed = new EmbedBuilder()
        .setAuthor({
          name: `${target.user.username}`,
          iconURL: target.displayAvatarURL({ format: 'jpg', size: 1024 }),
        })
        .setFields(
          {
            name: `Dołączył`,
            value:
              `${emoji.WIEMJAKLOGO} Serwer: <t:${Number(join).toFixed()}:D>, <t:${Number(join).toFixed()}:R>\n` +
              `${emoji.DISCORDLOGO} Discord: <t:${Number(create).toFixed()}:D>, <t:${Number(create).toFixed()}:R>`,
            inline: false,
          },
          {
            name: `Ostatnia aktywność`,
            value:
              `Text: <t:${Number(data.Lastmessagetime / 1000).toFixed()}:D>, <t:${Number(
                data.Lastmessagetime / 1000,
              ).toFixed()}:R>\n` +
              `Voice: <t:${Number(data.Lastvoicestatus / 1000).toFixed()}:D>, <t:${Number(
                data.Lastvoicestatus / 1000,
              ).toFixed()}:R>\n` +
              `Lastvot: ???`,
            inline: false,
          },
          {
            name: `Statystyki (${level} lvl, ${percentage})`,
            value: `${data.Money.toFixed(2)} ${emoji.jascoin} :black_small_square: ${data.Voicecount.toFixed(2)} ${
              emoji.karaoke
            } :black_small_square: ${data.Messagescount} ${emoji.NOTE} :black_small_square: ${(
              data.Voicecount * 60 * settings.ecoVCxp +
              data.Messagescount * settings.ecoMSGxp
            ).toFixed()} ${emoji.XP}  `,
            inline: false,
          },
        )
        .setThumbnail(target.displayAvatarURL({ format: 'jpg', size: 1024 }))
        .setColor('Random');
    }
    return interaction.followUp({ embeds: [embed] });
  },
};
