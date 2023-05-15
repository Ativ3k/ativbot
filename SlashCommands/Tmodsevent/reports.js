const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');

client.on('interactionCreate', async (interaction) => {
  const yes = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('reportpositive')
        .setLabel(`Prawda | (${interaction.user.tag})`)
        .setStyle('Success')
        .setEmoji(`${emoji.SUCCESS}`)
        .setDisabled(true),
    )
    .addComponents(
      new ButtonBuilder().setCustomId('reportedit').setLabel(`Edytuj`).setStyle('Secondary').setEmoji(`⚙️`),
    );

  const idk = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('reportidk')
        .setLabel(`IDK | (${interaction.user.tag})`)
        .setStyle('Secondary')
        .setEmoji(`⚠️`)
        .setDisabled(true),
    )
    .addComponents(
      new ButtonBuilder().setCustomId('reportedit').setLabel(`Edytuj`).setStyle('Secondary').setEmoji(`⚙️`),
    );

  const no = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('reportfalse')
        .setLabel(`Fałsz | (${interaction.user.tag})`)
        .setStyle('Danger')
        .setEmoji(`${emoji.FAILURE}`)
        .setDisabled(true),
    )
    .addComponents(
      new ButtonBuilder().setCustomId('reportedit').setLabel(`Edytuj`).setStyle('Secondary').setEmoji(`⚙️`),
    );

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('reportpositive')
        .setLabel('Prawda')
        .setStyle('Success')
        .setEmoji(`${emoji.SUCCESS}`),
    )
    .addComponents(new ButtonBuilder().setCustomId('reportidk').setLabel('IDK').setStyle('Secondary').setEmoji(`⚠️`))
    .addComponents(
      new ButtonBuilder().setCustomId('reportfalse').setLabel('Fałsz').setStyle('Danger').setEmoji(`${emoji.FAILURE}`),
    );

  if (interaction.customId === 'reportpositive') {
    interaction.message.edit({ components: [yes] });
    interaction.deferUpdate();
  }

  if (interaction.customId === 'reportidk') {
    interaction.message.edit({ components: [idk] });
    interaction.deferUpdate();
  }

  if (interaction.customId === 'reportfalse') {
    interaction.message.edit({ components: [no] });
    interaction.deferUpdate();
  }
  if (interaction.customId === 'reportedit') {
    interaction.message.edit({ components: [buttons] });
    interaction.deferUpdate();
  }
});
