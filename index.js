require('dotenv').config();
const { Collection, Client, IntentsBitField, Partials } = require('discord.js');

const myIntents = new IntentsBitField(131071);

const client = new Client({
  allowedMentions: {
    repliedUser: true,
    parse: ['users', 'roles', 'everyone'],
  },
  intents: myIntents,
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

const discordModals = require('discord-modals');

discordModals(client);

module.exports = client;

client.commands = new Collection();
client.aliases = new Collection();
client.SlashCommands = new Collection();
require('events').EventEmitter.defaultMaxListeners = 25;

require('./Handler/handler')(client);

client.login(process.env.TOKEN);
