const {
  ActionRowBuilder,
  ButtonBuilder,

  EmbedBuilder,

  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'vote',
  description: 'Głosowanie na Timeout (5 minut).',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'użytkownik',
      description: 'Wybierz użytkownika',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction, message) => {
    // const alllog = client.channels.cache.get("988342883138551828");
    // alllog.send({ content: `${emoji.INFO} ${interaction.member} używa **\`/${interaction.command.name}\`** na kanale ${interaction.channel}` })
    const TARGET = interaction.options.getMember('użytkownik');

    const expires = new Date();
    const timeleft = expires.setMinutes(expires.getMinutes()) / 1000 + 60;
    const timeout = expires.setMinutes(expires.getMinutes()) / 1000 + 300;
    const TIME = (timeout - Date.now() / 1000) * 1000;
    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('voteyes').setLabel('TAK').setStyle('Secondary').setEmoji(`${emoji.TAK}`),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('voteno').setLabel('NIE').setStyle('Secondary').setEmoji(`${emoji.NIE}`),
      )
      .addComponents(new ButtonBuilder().setCustomId('deletevote').setStyle('Secondary').setEmoji(`${emoji.TRASH}`));
    const embed = new EmbedBuilder()
      .setTitle('[TRWA]')
      .setColor('Orange')
      .setDescription(
        `${emoji.NOTE} **Głosowanie**(${interaction.member})\n${emoji.INFO} Przerwa dla ${TARGET}. \n${
          emoji.TIME
        } Koniec: <t:${Number(timeleft)}:R>`,
      )
      .setFields(
        { name: `‎`, value: `\`\`\`✅ TAK (0)\`\`\`\n -`, inline: true },
        { name: `‎`, value: `\`\`\`❌ NIE (0)\`\`\`\n -`, inline: true },
      );
    interaction.reply({
      content: `${emoji.SUCCESS} Pomyślnie rozpoczęto głosowanie na ${TARGET}!`,
      ephemeral: true,
    });
    interaction.channel.send({ embeds: [embed], components: [button] }).then(async () => {
      const votes = {
        voteyes: new Set(),
        voteno: new Set(),
      };
      async function update() {
        const userYes = votes.voteyes.size === 0 ? '-' : [...votes.voteyes];
        const userNo = votes.voteno.size === 0 ? '-' : [...votes.voteno];
        const newEmbed = new EmbedBuilder()
          .setTitle('[TRWA]')
          .setColor('Orange')
          .setDescription(
            `${emoji.NOTE} **Głosowanie**\n` +
              `${emoji.INFO} Przerwa dla ${TARGET}. \n${emoji.TIME} Koniec: <t:${Number(timeleft)}:R>`,
          )
          .setFields(
            {
              name: `‎`,
              value: `\`\`\`✅ TAK (${votes.voteyes.size})\`\`\`\n${userYes}`,
              inline: true,
            },
            {
              name: `‎`,
              value: `\`\`\`❌ NIE (${votes.voteno.size})\`\`\`\n${userNo}`,
              inline: true,
            },
          );
        await message.edit({ embeds: [newEmbed] });
      }

      const collector = message.createMessageComponentCollector({
        componentType: 2,
        time: 60000,
      });
      async function stop() {
        collector.stop();
        const newEmbed = await new EmbedBuilder(message.embeds[0]);
        newEmbed.title = '[Zakończone]';

        const userYes = votes.voteyes.size === 0 ? '-' : [...votes.voteyes];
        const userNo = votes.voteno.size === 0 ? '-' : [...votes.voteno];
        newEmbed.setFields([
          {
            name: `‎`,
            value: `\`\`\`✅ TAK (${votes.voteyes.size})\`\`\`\n${userYes}`,
            inline: true,
          },
          {
            name: `‎`,
            value: `\`\`\`❌ NIE (${votes.voteno.size})\`\`\`\n${userNo}`,
            inline: true,
          },
        ]);

        if (votes.voteyes.size >= 6) {
          TARGET.timeout(TIME, 'Przegłosowano na TAK!');
          newEmbed.setColor('Green');
          newEmbed.setDescription(
            `${emoji.SUCCESS} Głos ludu przemówił!\n${emoji.NOTE} Większość zagłosowała na **\`TAK\`**.\n${
              emoji.INFO
            } ${TARGET} dostał przerwe: <t:${Number(timeout)}:R>.`,
          );
        } else if (votes.voteno.size >= 6) {
          newEmbed.setColor('Red');
          newEmbed.setDescription(
            `${emoji.FAILURE} Głos ludu przemówił!\n${emoji.NOTE} Większość zagłosowała na **\`NIE\`**.\n${emoji.INFO} ${TARGET} nie dostaje przerwy!`,
          );
        } else {
          newEmbed.setColor('DarkButNotBlack');
          newEmbed.setDescription(
            `${emoji.STOP} Zbyt mała ilość glosów, odrzucono!\n${emoji.INFO} ${TARGET} nie dostaje przerwy!`,
          );
        }

        await message.edit({ embeds: [newEmbed], components: [] });
      }
      collector.on('collect', async (i) => {
        const ROLE = '704358019923968011';
        const hasRole = i.member.roles.cache.has(ROLE);
        if (!hasRole) {
          return i.reply({
            content: `Głosowanie dostępne od rangi <@&${ROLE}>!`,
            ephemeral: true,
          });
        }
        if (hasRole) {
          if (i.member.id === TARGET.id) {
            return i.reply({
              content: `Nie możesz brać udziału w głosowaniu na samego siebie!`,
              ephemeral: true,
            });
          }
          if (i.customId === 'voteyes') {
            votes.voteno.delete(i.member);
            votes[i.customId].add(i.member);
            await update();
            return i.reply({
              content: `${emoji.SUCCESS} Oddano głos na **\`TAK\`**.`,
              ephemeral: true,
            });
          }
          if (i.customId === 'voteno') {
            votes.voteyes.delete(i.member);
            votes[i.customId].add(i.member);
            await update();
            return i.reply({
              content: `${emoji.SUCCESS} Oddano głos na **\`NIE\`**.`,
              ephemeral: true,
            });
          }
          if (i.customId === 'deletevote') {
            votes.voteyes.delete(i.member);
            votes.voteno.delete(i.member);
            await update();
            return i.reply({
              content: `${emoji.TRASH} Pomyślnie usunięto Twój głos.`,
              ephemeral: true,
            });
          }
        }
        return 0;
      });
      collector.on('end', () => {
        stop();
      });
    });
  },
};
