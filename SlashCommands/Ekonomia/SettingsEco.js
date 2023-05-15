const { SelectMenuBuilder, ActionRowBuilder, ApplicationCommandType } = require('discord.js');
const setting = require('../../Models/GuildSettings');

module.exports = {
  name: 'ecosetting',
  description: 'ekonomiatest',
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: 'Administrator',
  dm_permission: 0,
  /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {Message} message

     * @raturns
    */

  run: async (client, interaction) => {
    const data = await setting.findOne({ GuildId: interaction.guild.id });

    const ecoVCmoney = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId('ecoVCmoney')
        .setPlaceholder(`Ilość coinów za minute. (${data.ecoVCmoney || `?`})`)
        .addOptions([
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9 ', value: '9' },
          { label: '10', value: '10' },
          { label: '11', value: '11' },
          { label: '12', value: '12' },
          { label: '13', value: '13' },
          { label: '14', value: '14' },
          { label: '15', value: '15' },
          { label: '16', value: '16' },
          { label: '17', value: '17' },
          { label: '18', value: '18' },
          { label: '19', value: '19' },
          { label: '20', value: '20' },
        ]),
    );
    const ecoVCxp = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId('ecoVCxp')
        .setPlaceholder(`Ilość XP za minute. (${data.ecoVCxp || `?`})`)
        .addOptions([
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9 ', value: '9' },
          { label: '10', value: '10' },
          { label: '11', value: '11' },
          { label: '12', value: '12' },
          { label: '13', value: '13' },
          { label: '14', value: '14' },
          { label: '15', value: '15' },
          { label: '16', value: '16' },
          { label: '17', value: '17' },
          { label: '18', value: '18' },
          { label: '19', value: '19' },
          { label: '20', value: '20' },
        ]),
    );
    const ecoMSGmoney = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId('ecoMSGmoney')
        .setPlaceholder(`Ilość coinów za wiadomość. (${data.ecoMSGmoney || `?`})`)
        .addOptions([
          { label: '0.25', value: '0.25' },
          { label: '0.5', value: '0.5' },
          { label: '0.75', value: '0.75' },
          { label: '1', value: '1' },
          { label: '1.25', value: '1.25' },
          { label: '1.50', value: '1.5' },
          { label: '1.75', value: '1.75' },
          { label: '2', value: '2' },
          { label: '2.25', value: '2.25' },
          { label: '2.50', value: '2.5' },
          { label: '2.75', value: '2.75' },
          { label: '3', value: '3' },
          { label: '3.25', value: '3.25' },
          { label: '3.5', value: '3.5' },
          { label: '3.75', value: '3.75' },
          { label: '4', value: '4' },
          { label: '4.25', value: '4.25' },
          { label: '4.50', value: '4.5' },
          { label: '4.75', value: '4.75' },
          { label: '5', value: '5' },
        ]),
    );
    const ecoMSGxp = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId('ecoMSGxp')
        .setPlaceholder(`Ilość XP za wiadomosć. (${data.ecoMSGxp || `?`})`)
        .addOptions([
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9 ', value: '9' },
          { label: '10', value: '10' },
          { label: '11', value: '11' },
          { label: '12', value: '12' },
          { label: '13', value: '13' },
          { label: '14', value: '14' },
          { label: '15', value: '15' },
          { label: '16', value: '16' },
          { label: '17', value: '17' },
          { label: '18', value: '18' },
          { label: '19', value: '19' },
          { label: '20', value: '20' },
        ]),
    );

    await interaction.reply({
      components: [ecoVCmoney, ecoVCxp, ecoMSGmoney, ecoMSGxp],
      ephemeral: true,
    });
  },
};
