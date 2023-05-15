const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');
const { inspect } = require('util');
const client = require('../index');

client.on('error', (err) => {
  const a = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.yellow('——————————[ERROR]——————————\n') + err);
  a.send({
    content: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``,
  });
  return console.log(`${inspect(err, { depth: 0 })}`);
});
process.on('unhandledRejection', (reason, p) => {
  const b = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.yellow('——————————[Unhandled Rejection/Catch]——————————\n'), reason, p);
  return b.send({
    content: `Reason:\n\`\`\`${inspect(reason, {
      depth: 0,
    })}\`\`\`\n\nPromise:\n\`\`\`${inspect(p, { depth: 0 })}\`\`\``,
  });
});
process.on('uncaughtException', (err, origin) => {
  const c = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.yellow('——————————[Uncaught Exception/Catch]——————————\n'), err, origin);
  const uncaughtExceptionEmbed = new EmbedBuilder()
    .setTitle('Uncaught Exception/Catch')
    .setColor('#2F3136')
    .setURL('https://nodejs.org/api/process.html#event-uncaughtexception')
    .addFields([
      {
        name: 'Error',
        value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000),
      },
      {
        name: 'Origin',
        value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(0, 1000),
      },
    ])
    .setTimestamp();
  return c.send({
    embeds: [uncaughtExceptionEmbed],
  });
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  const d = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.yellow('——————————[Uncaught Exception/Catch (MONITOR)]——————————\n'), err, origin);
  const uncaughtExceptionMonitorEmbed = new EmbedBuilder()
    .setTitle('Uncaught Exception Monitor')
    .setColor('#2F3136')
    .setURL('https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor')
    .addFields([
      {
        name: 'Error',
        value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000),
      },
      {
        name: 'Origin',
        value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(0, 1000),
      },
    ])

    .setTimestamp();

  return d.send({
    embeds: [uncaughtExceptionMonitorEmbed],
  });
});
process.on('warning', (warn) => {
  const f = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.yellow('——————————[Warning]——————————\n'), warn);
  const warningEmbed = new EmbedBuilder()
    .setTitle('Warning')
    .setColor('#2F3136')
    .setURL('https://nodejs.org/api/process.html#event-warning')
    .addFields([
      {
        name: 'Warn',
        value: `\`\`\`${inspect(warn, { depth: 0 })}\`\`\``.substring(0, 1000),
      },
    ])

    .setTimestamp();
  return f.send({
    embeds: [warningEmbed],
  });
});
