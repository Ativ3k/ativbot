const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  CommandInteraction,
} = require('discord.js');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');

module.exports = {
  name: 'wallet',
  description: 'Twój portfel serwerowy.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'przelej',
      type: ApplicationCommandOptionType.User,
      description: 'Komu?',
      required: false,
    },
    {
      name: 'kwota',
      type: ApplicationCommandOptionType.Number,
      description: 'Ile coinów?',
      min_value: 1,
      max_value: 1000000000,
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
    const { member } = interaction;
    const data = await db.findOne({
      Guildid: interaction.guild.id,
      Memberid: member.id,
    });
    if (!data) {
      return interaction.reply({
        content: `Error, brak danych o członku!\nAby stworzyć profil członka spełnij jakikolwiek warunek wyjaśniony w </ecohelp:1023094862695903242>.`,
      });
    }
    const create = interaction.user.createdTimestamp / 1000;
    const join = member.joinedTimestamp / 1000;
    const settings = await guildSettings.findOne({
      GuildId: interaction.guild.id,
    });
    const transfer = interaction.options.getNumber('kwota');
    const target = interaction.options.getMember('przelej');
    if (transfer >= 1 && target && data.Money >= transfer) {
      const receiver = await db.findOne({
        Guildid: interaction.guild.id,
        Memberid: target.id,
      });
      await data.updateOne({ $inc: { Money: -transfer } });
      await receiver.updateOne({ $inc: { Money: transfer } });

      const embed = new EmbedBuilder()
        .setDescription(`${emoji.success} Pomyślnie przelano **${transfer}** ${emoji.jascoin} do portfela ${target}.`)
        .setColor('Blue');
      return interaction.reply({ embeds: [embed] });
    }
    if (!transfer && target) {
      const embed = new EmbedBuilder().setDescription(`Podaj ile chcesz przelać ${emoji.jascoin}!`).setColor('Blue');
      return interaction.reply({ embeds: [embed] });
    }
    if (transfer > data.Money) {
      const embed = new EmbedBuilder().setDescription(`Nie masz wystarczająco ${emoji.jascoin}!`).setColor('Blue');
      return interaction.reply({ embeds: [embed] });
    }
    if (transfer && !target) {
      const embed = new EmbedBuilder().setDescription(`Podaj komu chcesz przelać ${emoji.jascoin}!`).setColor('Blue');
      return interaction.reply({ embeds: [embed] });
    }
    let totalxp;
    let level;
    let nextlvl;
    let curlvlXP;
    let embed;
    if (!target || !transfer) {
      if (data) {
        totalxp = data.Voicecount * 60 * settings.ecoVCxp + data.Messagescount * settings.ecoMSGxp;
        const levels = Array.from({ length: 200 }, (_, i) => (300 * (i + 1) * (i + 1)) / 2 - (i + 1) * 50 - 100);
        // todo: add roles for selected level and send log/dm when someone get levelup
        levels.forEach((v, i) => {
          if (totalxp >= v) {
            level = i + 1;
            nextlvl = 100 + level * 300;
            curlvlXP = v;
          }
        });

        const sum = totalxp;
        const curlvlxp = (curlvlXP - sum) * -1;
        const percentage = `${((curlvlxp / nextlvl) * 100).toFixed(2)}%`;
        let multipler = 1;

        const monthsInServer = ((Date.now() - member.joinedTimestamp) / 2_629_700_000) * 0.01;
        multipler += monthsInServer;
        const boostingServer = member.premiumSince
          ? ((Date.now() - member.premiumSinceTimestamp) / 2_629_700_000) * 0.01 + 0.05
          : 0;
        if (member.premiumSince) multipler += boostingServer;
        multipler += interaction.guild.premiumSubscriptionCount * 0.01;
        embed = new EmbedBuilder()
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
              name: `Multipler`,
              value:
                `Staż: \`${monthsInServer.toFixed(5)}\`\n` +
                `Boosting: \`${boostingServer.toFixed(5)}\`\n` +
                `Global boost: \`${interaction.guild.premiumSubscriptionCount * 0.01}\`\n` +
                `Total: \`${multipler.toFixed(5)}\``,
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
          .setThumbnail(member.displayAvatarURL({ format: 'jpg', size: 1024 }))
          .setColor('Random');
      }
    }
    return interaction.reply({ embeds: [embed] });
  },
};
