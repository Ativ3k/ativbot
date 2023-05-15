const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const TicTacToe = require('discord-tictactoe');

const game = new TicTacToe({ language: 'pl', commandOptionName: 'użytkownik' });

module.exports = {
  name: 'tictactoe',
  description: 'Kółko i krzyżyk.',
  cooldown: 15,
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'użytkownik',
      description: 'Z kim chcesz zagrać?',
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    game.handleInteraction(interaction);
  },
};
