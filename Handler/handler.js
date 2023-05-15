const { glob } = require('glob');
const { promisify } = require('util');

const globPromise = promisify(glob);
const chalk = require('chalk');
const Logger = require('../utils/logger');

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // Slash Commands Handler
  const SlashCommands = [];
  const SlashCommandsFiles = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
  SlashCommandsFiles.map(async (path) => {
    const file = require(path);
    if (!file?.name) return;
    const splitted = path.split('/');
    const dir = splitted[splitted.length - 2];
    const files = {
      dir,
      ...file,
    };
    client.SlashCommands.set(file.name, files);
    if (('MESSAGE', 'USER'.includes(file.type))) delete file.description;
    SlashCommands.push(file);
  });

  client.on('ready', async () => {
    // Slash Commands all guilds
    client.application.commands
      .set(SlashCommands)
      .then(
        Logger.log(
          chalk.white(`✅ Pomyślnie zarejestrowano `) +
            chalk.red(client.SlashCommands.size) +
            chalk.white(' GlobalCMD ') +
            chalk.red(client.guilds.cache.size) +
            chalk.white(`${client.guilds.cache.size > 1 ? ' serwerach ' : ' serwerze'}`),
        ),
      );
  });

  // Events Handler
  const eventFiles = await globPromise(`${process.cwd()}/Events/*.js`);
  eventFiles.map(async (filePaths) => require(filePaths));
};
