const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { ObjectId } = require('mongodb');
const warnSchema = require('../../Models/warndb');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'warn',
  description: 'Nakłada ostrzeżenie na użytkownika',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      type: 1,
      name: 'add',
      description: 'Nakłada ostrzeżenie na użytkownika.',
      options: [
        {
          name: 'user',
          type: ApplicationCommandOptionType.User,
          description: 'Kto ma dostać ostrzeżenie',
          required: true,
        },
        {
          name: 'reason',
          type: ApplicationCommandOptionType.String,
          description: 'Powód',
          required: true,
        },
        {
          name: 'czas',
          description: 'Czas trwania warna. (1 = 1 minuta, 1h = 1 godzina, 1d = 1 dzień)',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: 'punkty',
          description: 'Ilość punktów',
          required: false,
          type: ApplicationCommandOptionType.Number,
        },
      ],
    },
    {
      type: 1,
      name: 'remove',
      description: 'Zdejmuje warna',
      options: [
        {
          name: 'id',
          type: ApplicationCommandOptionType.String,
          description: 'ID warna',
          required: true,
        },
        {
          name: 'user',
          type: ApplicationCommandOptionType.User,
          description: 'Kto ma dostać ostrzeżenie',
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: 'delete',
      description: 'Usuwa warna',
      options: [
        {
          name: 'id',
          type: ApplicationCommandOptionType.String,
          description: 'ID warna',
          required: true,
        },
        {
          name: 'user',
          type: ApplicationCommandOptionType.User,
          description: 'Kto ma dostać ostrzeżenie',
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
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    const id = interaction.options.getString('id');
    const pkt = interaction.options.getNumber('punkty') || 1;
    const immunerole = '986017883727491132';
    const logi = client.channels.cache.get('679054786649128999');
    const roleimmune = member.roles.cache.has(immunerole);

    if (member.bannable) {
      if (roleimmune) {
        const shield = new EmbedBuilder()
          .setColor('Red')
          .setDescription(`${emoji.SHIELDMOD} Ten użytkownik jest chroniony przez <@&${immunerole}>!`);
        return interaction.reply({ embeds: [shield] });
      }
      if (subCommand === 'add' && !roleimmune) {
        const args = interaction.options.getString('czas').split(' ');
        const duration = args.shift();
        let time;
        let type;
        try {
          const split = duration.match(/\d+|\D+/g);
          time = parseFloat(split[0]);
          type = split[1].toLowerCase();
        } catch (e) {
          return console.log(e);
        }
        if (type === 'h') {
          time *= 60;
        }

        if (type === 'd') {
          time *= 60 * 24;
        }

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + time);
        const timeleft = expires.setMinutes(expires.getMinutes());

        await new warnSchema.create({
          GuildID: interaction.guild.id,
          MemberID: user.id,
          Reason: reason,
          ModID: interaction.user.id,
          Time: Date.now(),
          Timeleft: timeleft,
          Punkty: pkt,
        }).save();

        const dataupdate = await warnSchema.find({
          GuildID: interaction.guild.id,
          MemberID: user.id,
        });
        const punkty = await dataupdate
          .filter((x) => x.Punkty && x.Timeleft > Date.now())
          .map((x) => x.Punkty)
          .reduce((sum, a) => sum + a, 0);
        const dzien = 1000 * 60 * 60 * 24;
        if (punkty === 4) {
          member.timeout(dzien * 1, `Osiągnięcie 4 punktów ostrzeżeń!`);
        }
        if (punkty === 5) {
          member.timeout(dzien * 2, `Osiągnięcie 5 punktów ostrzeżeń!`);
        }
        if (punkty === 6) {
          member.timeout(dzien * 3, `Osiągnięcie 6 punktów ostrzeżeń!`);
        }
        if (punkty === 7) {
          member.timeout(dzien * 4, `Osiągnięcie 7 punktów ostrzeżeń!`);
        }
        if (punkty >= 10 && punkty <= 24) {
          member.timeout(dzien * punkty, `Osiągnięcie >=10 punktów ostrzeżeń!`);
        }
        if (punkty >= 25) {
          member.timeout(dzien * 28, `Osiągnięcie >=25 punktów ostrzeżeń!`);
        }

        const embed = new EmbedBuilder()
          .setColor('Red')
          .setDescription(
            `${emoji.wykrzyknik} **Nałożono ostrzeżenie na:** <@${user.id}>\n${emoji.MEMBER} **Przez:** ${
              interaction.member
            } \n${emoji.DATA} **Kończy się:** <t:${(timeleft / 1000).toFixed(0)}:R>\n${
              emoji.NOTE
            } **Powód:** ${reason}\n${emoji.INFO} **Punkty:** ${pkt}`,
          )
          .setFooter({ text: `${user.id} + ${user.username}` });
        logi.send({ embeds: [embed] });
        return interaction.reply({ embeds: [embed] });
      }

      if (subCommand === 'remove') {
        const objId = new ObjectId(id);
        const checkuser = await warnSchema.findOne({ _id: objId });
        if (checkuser) {
          await checkuser.updateOne({ Timeleft: Date.now() });
          const removeWarn = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setDescription(`Zdjęto warna o ID \`${id}\` użytkownika <@${checkuser.MemberID}>`);

          return interaction.reply({ embeds: [removeWarn] });
        }
        return interaction.reply({ content: `Nie znaleziono warna!` });
      }
    }

    if (subCommand === 'delete') {
      const myregexp = /^[0-9a-fA-F]{24}$/;
      if (!id.match(myregexp)) {
        return interaction.reply({ content: `Błędne ID warna!` });
      }
      const objId = new ObjectId(id);
      const checkuser = await warnSchema.findOne({
        _id: objId,
        MemberID: member.id,
      });
      if (checkuser) {
        await checkuser.delete();
        const deleteWarn = new EmbedBuilder()
          .setColor('#FFFFFF')
          .setDescription(`Usunięto warna o ID \`${id}\` użytkownika <@${checkuser.MemberID}>`);

        return interaction.reply({ embeds: [deleteWarn] });
      }
      return interaction.reply({ content: `Nie znaleziono warna!` });
    }

    const error = new EmbedBuilder().setColor('Red').setDescription(`${emoji.FAILURE} Ten użytkownik jest chroniony!`);
    return interaction.reply({ embeds: [error] });
  },
};
