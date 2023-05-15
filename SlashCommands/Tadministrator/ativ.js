const {
  EmbedBuilder,
  ApplicationCommandType,
  CommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const Eco = require('../../Models/Eco');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'test',
  description: 'test.',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction) => {},
};
