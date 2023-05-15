const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const os = require('os');
const moment = require('moment');

module.exports = {
  name: 'ping',
  description: 'Pong! 🏓',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const core = os.cpus()[0];
    // const clientCreated = utc(client.user.createdTimesstamp).format('Do MMMM YYYY');
    // const servers = client.guilds.cache.size.toLocaleString();
    // const users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString();
    // const channels = client.channels.cache.size.toLocaleString();
    const uptime = moment.duration(client.uptime);
    const sec = uptime.seconds() === 1 ? `**\`${uptime.seconds()}\`** sekunde` : `**\`${uptime.seconds()}\`** sekund`;
    const min = uptime.minutes() === 1 ? `**\`${uptime.minutes()}\`** minut` : `**\`${uptime.minutes()}\`** minut`;
    const hr = uptime.hours() === 1 ? `**\`${uptime.hours()}\`** godzine` : `**\`${uptime.hours()}\`** godzin`;
    const days = uptime.days() === 1 ? `**\`${uptime.days()}\`** dzień` : `**\`${uptime.days()}\`** dni`;

    const embed = new EmbedBuilder().setColor('#FFFFFF').addFields(
      {
        name: 'Ping',
        value: `**\`API Ping:\`**\`${Math.round(client.ws.ping)}ms\`\n**\`Interaction Ping:\`**\` Pingowanie...\``,
      },
      {
        name: 'Uptime',
        value: `${days}, ${hr}, ${min}, ${sec}`,
      },
      {
        name: 'BOT Info',
        value:
          `**\`Tag:\`**\`${client.user.tag}\`\n` +
          `**\`ID:\`**\`${client.user.id}\`\n` +
          `**\`Liczba komend:\`**\`${client.SlashCommands.size}\``,
      },
      // {
      //   name: 'CPU Info',
      //   value:
      //     `**\`CPU Model:\`**\`${core.model}\`\n` +
      //     `**\`CPU Cores:\`**\`${os.cpus().length}\`\n` +
      //     `**\`CPU Speed:\`**\`${core.speed / 1000} GHz\``,
      // },
    );

    await interaction.reply({
      embeds: [embed],
    });
    const msgPing = Date.now() - interaction.createdTimestamp;

    const edit = new EmbedBuilder().setColor('#FFFFFF').addFields(
      {
        name: 'Ping',
        value: `**\`API Ping:\`**\`${Math.round(client.ws.ping)}ms\`\n**\`Interaction Ping:\`**\`${msgPing}ms\``,
      },
      {
        name: 'Uptime',
        value: `${days}, ${hr}, ${min}, ${sec}`,
      },
      {
        name: 'BOT Info',
        value: `**\`Tag:\`**\`${client.user.tag}\`\n**\`ID:\`**\`${client.user.id}\`\n**\`Liczba komend:\`**\`${client.SlashCommands.size}\``,
      },
      // {
      //     name: 'CPU Info',
      //     value: `**\`CPU Model:\`**\`${core.model}\`\n**\`CPU Cores:\`**\`${os.cpus().length}\`\n**\`CPU Speed:\`**\`${core.speed / 1000} GHz\``,
      // },
    );

    await interaction.editReply({ embeds: [edit] });
  },
};
