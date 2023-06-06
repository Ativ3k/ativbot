const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');
const { inspect } = require('util');
const client = require('../index');

client.on('error', (err) => {
  const errorChannel = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.red('——————————[ERROR]——————————\n') + err);
  const ErrorEmbed = new EmbedBuilder()
    .setTitle('Error')
    .setURL('https://discordjs.guide/popular-topics/errors.html#api-errors')
    .setColor('#2F3136')
    .setDescription(`\`\`\`${inspect(err, { depth: 0 })}\`\`\``)

    .setTimestamp();
  errorChannel.send({
    embeds: [ErrorEmbed],
  });
  return console.log(`${inspect(err, { depth: 0 })}`);
});
process.on('unhandledRejection', (reason, p) => {
  const errorChannel = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.red('——————————[Unhandled Rejection/Catch]——————————\n'), reason, p);
  const unhandledRejectionEmbed = new EmbedBuilder()
    .setTitle('Unhandled Rejection/Catch')
    .setURL('https://nodejs.org/api/process.html#event-unhandledrejection')
    .setColor('#2F3136')
    .addFields([
      { name: 'Reason', value: `\`\`\`${inspect(reason, { depth: 0 })}\`\`\``.substring(0, 1000) },
      { name: 'Promise', value: `\`\`\`${inspect(p, { depth: 0 })}\`\`\``.substring(0, 1000) },
    ])
    .setTimestamp();
  return errorChannel.send({
    embeds: [unhandledRejectionEmbed],
  });
});
process.on('uncaughtException', (err, origin) => {
  const errorChannel = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.red('——————————[Uncaught Exception/Catch]——————————\n'), err, origin);
  const uncaughtExceptionEmbed = new EmbedBuilder()
    .setTitle('Uncaught Exception/Catch')
    .setColor('#2F3136')
    .setURL('https://nodejs.org/api/process.html#event-uncaughtexception')
    .addFields([
      { name: 'Error', value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000) },
      { name: 'Origin', value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(0, 1000) },
    ])
    .setTimestamp();
  return errorChannel.send({
    embeds: [uncaughtExceptionEmbed],
  });
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  const errorChannel = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.red('——————————[Uncaught Exception/Catch (MONITOR)]——————————\n'), err, origin);
  const uncaughtExceptionMonitorEmbed = new EmbedBuilder()
    .setTitle('Uncaught Exception Monitor')
    .setColor('#2F3136')
    .setURL('https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor')
    .addFields([
      { name: 'Error', value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``.substring(0, 1000) },
      { name: 'Origin', value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``.substring(0, 1000) },
    ])

    .setTimestamp();

  return errorChannel.send({
    embeds: [uncaughtExceptionMonitorEmbed],
  });
});
process.on('warning', (warn) => {
  const errorChannel = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL);
  console.log(chalk.red('——————————[Warning]——————————\n'), warn);
  const warningEmbed = new EmbedBuilder()
    .setTitle('Warning')
    .setColor('#2F3136')
    .setURL('https://nodejs.org/api/process.html#event-warning')
    .addFields([{ name: 'Warn', value: `\`\`\`${inspect(warn, { depth: 0 })}\`\`\``.substring(0, 1000) }])

    .setTimestamp();
  return errorChannel.send({
    embeds: [warningEmbed],
  });
});
