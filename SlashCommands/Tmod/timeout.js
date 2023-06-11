const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  CommandInteraction,
} = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'timeout',
  description: 'Wyślij członka na przerwę.',
  userPermissions: 'KickMembers',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'użytkownik',
      description: 'Wybierz członka.',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'czas',
      description: 'Czas. (1 = 1 minuta, 1h = 1 godzina, 1d = 1 dzień)',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'powód',
      description: 'Powód.',
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'powiadomienie',
      description: 'Czy użytkownik ma dostać powiadomienie?',
      required: false,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'NIE',
          value: '1',
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
    const target = interaction.options.getMember('użytkownik');
    const user = interaction.options.getUser('użytkownik');
    const reason = interaction.options.getString('powód');
    const silent = interaction.options.getString('powiadomienie');
    const powod = reason || '??';
    const logi = client.channels.cache.get('679054786649128999');
    const unTimeout = interaction.options.getString('czas');
    const args = interaction.options.getString('czas').split(' ');
    const duration = args.shift();

    const memberExists = interaction.guild.members.cache.has(user.id);
    if (!memberExists) {
      const noMember = new EmbedBuilder().setColor('Red').setDescription(`${emoji.FAILURE} Nie znaleziono członka!!`);
      return interaction.reply({ embeds: [noMember] });
    }
    let time;
    let type;
    try {
      const split = duration.match(/\d+|\D+/g);
      time = Number(split[0]);
      type = split[1].toLowerCase();
    } catch (e) {
      console.log(e);
    }
    if (type === 'h') {
      time *= 60;
    }

    if (type === 'd') {
      time *= 60 * 24;
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + time);
    const timeleft = expires.setMinutes(expires.getMinutes()) / 1000;
    const TIME = (timeleft - Date.now() / 1000) * 1000;

    if (unTimeout === '0') {
      target.timeout(0);
      return interaction.reply(`${emoji.SUCCESS} Zdjęto przerwe!`);
    }

    const immunerole = '986017883727491132';
    const roleimmune = target.roles.cache.has(immunerole);

    if (target.bannable && !target.permissions.has('Administrator')) {
      if (roleimmune === true) {
        const shield = new EmbedBuilder()
          .setColor('Red')
          .setDescription(
            `${emoji.SHIELDMOD} Ten użytkownik jest chroniony przez <@&${immunerole}> lub uprawnienia \`ADMINISTRATOR\`!`,
          );

        return interaction.reply({ embeds: [shield] });
      }

      const embed = new EmbedBuilder()
        .setColor('Orange')
        .setDescription(
          `${emoji.TIMEOUT} **Wysłano na przerwe** ${target}.\n${emoji.MEMBER} **Przez:** <@${
            interaction.member.id
          }>\n${emoji.DATA} **Kończy się:** <t:${Number(timeleft).toFixed(0)}}:R>\n${emoji.NOTE} **Powód:** ${
            reason || '`Brak powodu`'
          }`,
        )
        .setFooter({ text: `${target.id} + ${user.username}` });

      if (silent === '1') {
        target.timeout(TIME, powod);
        logi.send({ embeds: [embed] });
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      if (silent !== '1') {
        target.timeout(TIME, powod);
        interaction.reply({ embeds: [embed] });

        const DM = new EmbedBuilder()
          .setColor('Orange')
          .setDescription(
            `${emoji.TIMEOUT} <@${interaction.member.id}> nałożył na Ciebie przerwę!\n${
              emoji.DATA
            } **Kończy się:** <t:${Number(timeleft).toFixed(0)}:R>\n${emoji.NOTE} **Powód:** ${
              reason || '`Brak powodu`'
            }`,
          )
          .setFooter({ text: 'Discord.gg/wiemjak' });

        target.send({ embeds: [DM] }).catch((err) => {
          console.log(err);
        });
        return logi.send({ embeds: [embed] });
      }
    }
    const error = new EmbedBuilder()
      .setColor('Red')
      .setDescription(`${emoji.FAILURE} Nie moge nałożyć przerwy na tego członka!`);

    return interaction.reply({ embeds: [error] });
  },
};
