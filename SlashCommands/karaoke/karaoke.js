const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const KaraokeDB = require('../../Models/KaraokeSchema');

module.exports = {
  name: 'karaoke',
  description: 'karaoke',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'vote',
      description: 'Nowy system vote',
      type: 1,
      options: [
        {
          name: 'użytkownik',
          description: 'Podaj użytkownika',
          type: 6,
          required: true,
        },
        {
          name: 'nrkaraoke',
          description: 'Nr karaoke',
          type: 10,
          required: true,
        },
      ],
    },
    {
      name: 'ticket-panel',
      description: 'Wyślij na kanał ticket-panel',
      type: 1,
      options: [
        {
          name: 'channel',
          description: 'Podaj kanał',
          type: 7,
          required: true,
        },
      ],
    },
    {
      name: 'zweryfikuj',
      description: 'Zweryfikuj użytkownika na karaoke',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'Podaj użytkownika',
          type: 6,
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

    if (subCommand === 'ticket-panel') {
      const channel = interaction.options.getChannel('channel');
      const embed = new EmbedBuilder()
        .setColor('#FFB808')
        .setDescription('**Kliknij poniżej aby utworzyć ticket w celu zapisu na <@&995107477232304188>.**');

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('event-open')
          .setEmoji(':createchannel:981698739406266439')
          .setLabel('Otwórz ticket.')
          .setStyle('Secondary'),
      );

      interaction.reply({ content: `Sukces! ${channel}`, ephemeral: true });
      channel.send({ embeds: [embed], components: [row] });
    }
    if (subCommand === 'vote') {
      const target = interaction.options.getMember('użytkownik');
      const nrkaraoke = interaction.options.getNumber('nrkaraoke');

      const embed = new EmbedBuilder()
        .setTitle(`Głosowanie Karaoke`)
        .setDescription(
          `${emoji.CHANNEL} **Rozpoczęte przez:** <@${interaction.member.id}>\n${emoji.NOTE} **Głosowanie na:**${target}`,
        )
        .setThumbnail(target.displayAvatarURL({ format: 'png', size: 4096 }))
        .setFields(
          { name: `‎`, value: `\`\`\`⭐⭐⭐⭐⭐ = 0\`\`\``, inline: false },
          { name: `‎`, value: `\`\`\`⭐⭐⭐⭐ = 0\`\`\``, inline: false },
          { name: '‎', value: `\`\`\`⭐⭐⭐ = 0\`\`\``, inline: false },
          { name: `‎`, value: `\`\`\`⭐⭐ = 0\`\`\``, inline: false },
          { name: `‎`, value: `\`\`\`⭐ = 0\`\`\``, inline: false },
        )
        .setColor('Yellow');

      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('karaokevote1')
            .setStyle('Secondary')
            .setEmoji(`${emoji.JEDEN}`)
            .setLabel('⭐'),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('karaokevote2').setStyle('Secondary').setEmoji(`${emoji.DWA}`).setLabel('⭐'),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('karaokevote3')
            .setStyle('Secondary')
            .setEmoji(`${emoji.TRZY}`)
            .setLabel('⭐'),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('karaokevote4')
            .setStyle('Secondary')
            .setEmoji(`${emoji.CZTERY}`)
            .setLabel('⭐'),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('karaokevote5')
            .setStyle('Secondary')
            .setEmoji(`${emoji.PIEC}`)
            .setLabel('⭐'),
        );
      const admin = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('karaokevoteclose').setStyle('Danger').setEmoji(`🔒`),
      );

      interaction.reply({ content: `${emoji.SUCCESS}`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button, admin] }).then(async (message) => {
        const lastmsg = message.id;
        await KaraokeDB.create({
          guildid: interaction.guild.id,
          karaokeID: nrkaraoke,
          userid: target.id,
          messid: lastmsg,
        }).save();
      });
    }
    if (subCommand === 'zweryfikuj') {
      const member = interaction.options.getMember('user');
      const hasRole = member.roles.cache.some((r) => r.id === '995107477232304188');

      if (!hasRole) {
        interaction
          .reply({
            content: `${emoji.SUCCESS} **Pomyślnie zapisano ${member} na karaoke!**`,
          })
          .catch(console.error);
        await member.roles.add('995107477232304188');
      } else if (hasRole) {
        interaction
          .reply({
            content: `<@${member}> jest już zapisany/a na karaoke!`,
            ephemeral: true,
          })
          .catch(console.error);
      }
    }
  },
};
