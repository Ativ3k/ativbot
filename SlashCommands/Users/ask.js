const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require('discord.js');
const emoji = require('../../json/emoji.json'); // my emoji

module.exports = {
  name: 'ask',
  description: 'Głosowanie.',
  cooldown: 30,
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'pytanie',
      description: 'Pytanie.',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'głosy',
      description: 'Ilość głosów.',
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction, message) => {
    const args = interaction.options.getString('pytanie');
    const próg = interaction.options.getNumber('głosy');
    if (próg === 0) {
      return interaction.reply({
        content: `${emoji.FAILURE} Niepoprawna ilość głosów!`,
        ephemeral: true,
      });
    }
    const threshold = próg;
    const embed = new EmbedBuilder()
      .setTitle('[TRWA]')
      .setDescription(
        `${emoji.CHANNEL} **Pytanie zadane przez:** <@${interaction.member.id}>\n${emoji.NOTE} **Pytanie:**\n${args}`,
      )
      .setFields(
        {
          name: `‎`,
          value: `\`\`\`✅ TAK (0/${threshold})\`\`\`\n -`,
          inline: true,
        },
        {
          name: `‎`,
          value: `\`\`\`❌ NIE (0/${threshold})\`\`\`\n -`,
          inline: true,
        },
        { name: '‎', value: `\`\`\`❓ Niepewne (0)\`\`\`\n -`, inline: true },
      )
      .setColor('Yellow');
    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('voteyes').setLabel('TAK').setStyle('Secondary').setEmoji(`${emoji.TAK}`),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('voteno').setLabel('NIE').setStyle('Secondary').setEmoji(`${emoji.NIE}`),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('voteidk').setLabel('Niepewne').setStyle('Secondary').setEmoji(`❓`),
      )
      .addComponents(new ButtonBuilder().setCustomId('deletevote').setStyle('Secondary').setEmoji(`${emoji.TRASH}`));
    interaction.reply({ content: `${emoji.SUCCESS}`, ephemeral: true });
    const votes = {
      voteyes: new Set(),
      voteno: new Set(),
      voteidk: new Set(),
    };
    interaction.channel.send({ embeds: [embed], components: [button] }).then(async () => {
      async function update() {
        const userYes = votes.voteyes.size === 0 ? '-' : [...votes.voteyes];
        const userNo = votes.voteno.size === 0 ? '-' : [...votes.voteno];
        const userUnsure = votes.voteidk.size === 0 ? '-' : [...votes.voteidk];
        const newEmbed = new EmbedBuilder()
          .setTitle('[TRWA]')
          .setDescription(
            `${emoji.CHANNEL} **Pytanie zadane przez:** <@${interaction.member.id}>\n${emoji.NOTE} **Pytanie:**\n${args}`,
          )
          .setFields(
            {
              name: `‎`,
              value: `\`\`\`✅ Tak (${votes.voteyes.size}/${threshold})\`\`\`\n${userYes}`,
              inline: true,
            },
            {
              name: `‎`,
              value: `\`\`\`❌ Nie (${votes.voteno.size}/${threshold})\`\`\`\n${userNo}`,
              inline: true,
            },
            {
              name: '‎',
              value: `\`\`\`❓ Niepewne (${votes.voteidk.size})\`\`\`\n${userUnsure}`,
              inline: true,
            },
          )
          .setColor('Yellow');

        await message.edit({ embeds: [newEmbed] });

        if (votes.voteyes.size > threshold) {
          newEmbed.addFields(
            {
              name: `‎`,
              value: `\`\`\`✅ Tak (${votes.voteyes.size}/${threshold})\`\`\`\n${userYes}`,
              inline: true,
            },
            {
              name: `‎`,
              value: `\`\`\`❌ Nie (${votes.voteno.size}/${threshold})\`\`\`\n${userNo}`,
              inline: true,
            },
            {
              name: '‎',
              value: `\`\`\`❓ Niepewne (${votes.voteidk.size})\`\`\`\n${userUnsure}`,
              inline: true,
            },
          );
          await stop(`${emoji.SUCCESS} Głos ludu przemówił! Większość zagłosowała na **\`TAK\`**.`);
        }
        if (votes.voteno.size > threshold) {
          newEmbed.addFields(
            {
              name: `‎`,
              value: `\`\`\`✅ Tak (${votes.voteyes.size}/${threshold})\`\`\`\n${userYes}`,
              inline: true,
            },
            {
              name: `‎`,
              value: `\`\`\`❌ Nie (${votes.voteno.size}/${threshold})\`\`\`\n${userNo}`,
              inline: true,
            },
            {
              name: '‎',
              value: `\`\`\`❓ Niepewne (${votes.voteidk.size})\`\`\`\n${userUnsure}`,
              inline: true,
            },
          );
          await stop(`${emoji.FAILURE} Głos ludu przemówił! Większość zagłosowała na **\`NIE\`**.`);
        }
      }
      const collector = message.createMessageComponentCollector({
        MessageComponentType: 'BUTTON',
      });
      async function stop(result) {
        collector.stop();
        const userYes = votes.voteyes.size === 0 ? '-' : [...votes.voteyes];
        const userNo = votes.voteno.size === 0 ? '-' : [...votes.voteno];
        const userUnsure = votes.voteidk.size === 0 ? '-' : [...votes.voteidk];
        const newEmbed = new EmbedBuilder()
          .setTitle('[Zakończone]')
          .setDescription(
            `${emoji.CHANNEL} **Pytanie zadane przez:** <@${interaction.member.id}>\n${emoji.NOTE} **Pytanie:**\n${args}\n**Wynik:**\n${result}`,
          )
          .setFields(
            {
              name: `‎`,
              value: `\`\`\`✅ Tak (${votes.voteyes.size}/${threshold})\`\`\`\n${userYes}`,
              inline: true,
            },
            {
              name: `‎`,
              value: `\`\`\`❌ Nie (${votes.voteno.size}/${threshold})\`\`\`\n${userNo}`,
              inline: true,
            },
            {
              name: '‎',
              value: `\`\`\`❓ Niepewne (${votes.voteidk.size})\`\`\`\n${userUnsure}`,
              inline: true,
            },
          );
        if (result.includes('TAK')) {
          newEmbed.setColor('Green');
        }
        if (result.includes('NIE')) {
          newEmbed.setColor('Red');
        }

        await message.edit({ embeds: [newEmbed], components: [] });
        await message.reactions.removeAll();
      }
      collector.on('collect', async (i) => {
        if (i.customId === 'voteyes') {
          votes.voteno.delete(i.member);
          votes.voteidk.delete(i.member);
          votes[i.customId].add(i.member);
          update();
          i.reply({
            content: `${emoji.SUCCESS} Oddano głos na **\`TAK\`**.`,
            ephemeral: true,
          });
        }
        if (i.customId === 'voteno') {
          votes.voteyes.delete(i.member);
          votes.voteidk.delete(i.member);
          votes[i.customId].add(i.member);
          update();
          i.reply({
            content: `${emoji.SUCCESS} Oddano głos na **\`NIE\`**.`,
            ephemeral: true,
          });
        }
        if (i.customId === 'voteidk') {
          votes.voteyes.delete(i.member);
          votes.voteno.delete(i.member);
          votes[i.customId].add(i.member);
          update();
          i.reply({
            content: `${emoji.SUCCESS} Oddano głos na **\`Niepewne\`**.`,
            ephemeral: true,
          });
        }
        if (i.customId === 'deletevote') {
          votes.voteyes.delete(i.member);
          votes.voteno.delete(i.member);
          votes.voteidk.delete(i.member);
          update();
          i.reply({
            content: `${emoji.TRASH} Pomyślnie usunięto Twój głos.`,
            ephemeral: true,
          });
        }
      });
    });
    return 0;
  },
};
