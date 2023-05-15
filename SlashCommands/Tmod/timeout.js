const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'timeout',
  description: 'Wyślij użytkownika na przerwę.',
  userPermissions: 'KickMembers',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'użytkownik',
      description: 'Wybierz użytkownika.',
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
    const TARGET = interaction.options.getMember('użytkownik');
    const USER = interaction.options.getUser('użytkownik');
    const REASON = interaction.options.getString('powód');
    const SILENT = interaction.options.getString('powiadomienie');
    // const czas = CZAS * 1000 * 60
    const powod = REASON || '';
    // const timeleft = (czas / 1000 + Date.now() / 1000)
    const logi = client.channels.cache.get('679054786649128999');
    const un = interaction.options.getString('czas');
    const args = interaction.options.getString('czas').split(' ');
    const duration = args.shift();
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

    if (un === '0') {
      TARGET.timeout(0);
      return interaction.reply(`${emoji.SUCCESS} Zdjęto przerwe!`);
    }

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setDescription(
        `${emoji.TIMEOUT} **Wysłano na przerwe** ${TARGET}.\n${emoji.MEMBER} **Przez:** <@${interaction.member.id}>\n${
          emoji.DATA
        } **Kończy się:** <t:${Number(timeleft)}:R>\n${emoji.NOTE} **Powód:** ${REASON || '`Brak powodu`'}`,
      )
      .setFooter({ text: `${TARGET.id} + ${USER.tag}` });
    const DM = new EmbedBuilder()
      .setColor('Orange')
      .setDescription(
        `${emoji.TIMEOUT} <@${interaction.member.id}> nałożył na Ciebie przerwę!\n${
          emoji.DATA
        } **Kończy się:** <t:${Number(timeleft)}:R>\n${emoji.NOTE} **Powód:** ${REASON || '`Brak powodu`'}`,
      )
      .setFooter({ text: 'Discord.gg/wiemjak' });

    const error = new EmbedBuilder()
      .setColor('Red')
      .setDescription(`${emoji.FAILURE} Nie moge nałożyć przerwy na tego użytkownika!`);

    const immunerole = '986017883727491132';

    const roleimmune = TARGET.roles.cache.has(immunerole);

    if (TARGET.bannable) {
      if (roleimmune === true) {
        const shield = new EmbedBuilder()
          .setColor('Red')
          .setDescription(`${emoji.SHIELDMOD} Ten użytkownik jest chroniony przez <@&${immunerole}>!`);

        return interaction.reply({ embeds: [shield] });
      }
      if (SILENT === '1') {
        TARGET.timeout(TIME, powod);
        interaction.reply({ embeds: [embed], ephemeral: true });
        logi.send({ embeds: [embed] });
      } else if (SILENT !== '1') {
        TARGET.timeout(TIME, powod);
        interaction.reply({ embeds: [embed] });
        TARGET.send({ embeds: [DM] }).catch((err) => {
          console.log(err);
        });
        logi.send({ embeds: [embed] });
      }
    }
    if (!TARGET.bannable) {
      interaction.reply({ embeds: [error] });
    }
    return 0;
  },
};
