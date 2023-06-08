const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const moment = require('moment');
const client = require('../index');
const testerRoleID = require('../json/devValues.json');
const cooldownSchema = require('../Models/CommandCooldown');
const emoji = require('../json/emoji.json');
const Logger = require('../utils/logger');

client.on('interactionCreate', async (interaction) => {
  const hours = `0${moment().utcOffset(2).hours()}`.slice(-2);
  const minutes = `0${moment().minutes()}`.slice(-2);
  const seconds = `0${moment().seconds()}`.slice(-2);

  // Slash Commands
  const command = client.SlashCommands.get(interaction.commandName);
  // If Command Doesnt exist
  if (!command) return client.SlashCommands.delete(interaction.commandName);

  // User Permissions Check
  if (!interaction.member.permissions.has(command.userPermissions || []))
    return interaction.reply({
      content: `${process.env.FAILURE_EMOJI} Potrzebujesz uprawnienia \`${
        command.userPermissions || []
      }\` aby użyc tej komendy`,
      ephemeral: true,
    });

  // Under Maintenance Commands
  if (command.test) {
    const hasRole = interaction.member.roles.cache.has(`${testerRoleID}`);
    const reply = new EmbedBuilder().setDescription(
      `${process.env.FAILURE_EMOJI} **Ta komenda jest jeszcze dopracowywana!\n<:info:978182842125275196> Dostęp do niej mają tylko osoby z rolą <@&${testerRoleID}>**`,
    );
    if (!hasRole) {
      return interaction.reply({
        embeds: [reply],
      });
    }
  }

  command.run(client, interaction);
  const ativ = client.channels.cache.get('1018086843469803590');

  // TODO command logs
  if (command.nolog === true) {
    return 0;
  }
  Logger.log(`${interaction} ${interaction.member.user.username}`, 'cmd');
  const embed = new EmbedBuilder()
    .setDescription(
      `**Komenda**: ${interaction}\n**Kanał:** ${interaction.channel} (${interaction.channel.id})\n**Członek:** ${interaction.user} (${interaction.user.id})`,
    )
    .setColor('Random');
  return ativ.send({ embeds: [embed] });
});
