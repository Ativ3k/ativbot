const client = require('../../index');
const settings = require('../../Models/GuildSettings');

client.on('interactionCreate', async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    const data = await settings.findOne({ GuildId: interaction.guild.id });
    if (interaction.customId === 'ecoVCmoney') {
      const value = interaction.values[0];
      await interaction.deferReply({ ephemeral: true });
      await data.updateOne({ ecoVCmoney: value });
      const updated = await settings.findOne({ GuildId: interaction.guild.id });
      await interaction.followUp(
        `Zmieniono ilość coinów na minute z **${data.ecoVCmoney}** na **${updated.ecoVCmoney}**`,
      );
    }
    if (interaction.customId === 'ecoVCxp') {
      const value = interaction.values[0];
      await interaction.deferReply({ ephemeral: true });
      await data.updateOne({ ecoVCxp: value });
      const updated = await settings.findOne({ GuildId: interaction.guild.id });
      await interaction.followUp(`Zmieniono ilość XP na minute z **${data.ecoVCxp}** na **${updated.ecoVCxp}**`);
    }

    if (interaction.customId === 'ecoMSGmoney') {
      const value = interaction.values[0];
      await interaction.deferReply({ ephemeral: true });
      await data.updateOne({ ecoMSGmoney: value });
      const updated = await settings.findOne({ GuildId: interaction.guild.id });
      await interaction.followUp(
        `Zmieniono ilość coinów za wiadomość z **${data.ecoMSGmoney}** na **${updated.ecoMSGmoney}**`,
      );
    }

    if (interaction.customId === 'ecoMSGexp') {
      const value = interaction.values[0];
      await interaction.deferReply({ ephemeral: true });
      await data.updateOne({ eceoMSGexp: value });
      const updated = await settings.findOne({ GuildId: interaction.guild.id });
      await interaction.followUp(
        `Zmieniono ilość XP za wiadomość z **${data.eceoMSGexp}** na **${updated.eceoMSGexp}**`,
      );
    }
  }
});
