const client = require('../index');
const prefix = process.env.PREFIX;
const emoji = require('../json/emoji.json');

client.on('messageCreate', async (message) => {
  const dobranocID = '159760934036963329';
  if (message.author.id === dobranocID && message.content.includes('Dobranocka')) {
    message.reply(`Dobranoc seksowny gnojku ❤${emoji.PEPEBEDGE}`);
  }

  if (message.author.id === '258891606873210880' && message.content.includes('!bench')) {
    const ram = process.memoryUsage().heapTotal / 1024 / 1024;
    message.reply(`result: ${ram}`);
  }

  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const cmd = args.shift().toLowerCase();
  const command = client.commands.get(cmd) || client.commands.find((c) => c.aliases?.includes(cmd));

  if (!command) return;

  if (command) {
    // User Permissions Check
    if (!message.member.permissions.has(command.userPermissions || []))
      message.reply({
        content: `${process.env.FAILURE_EMOJI} Potrzebujesz uprawnienia \`${
          command.userPermissions || []
        }\` aby użyc tej komendy`,
        ephemeral: true,
      });

    // Under Maintenance Commands TODO (need fix)
    // if (command.maintenance) {
    //   if (!owners.includes(message.user.id)) {
    //     message.reply({
    //       content: `${process.env.FAILURE_EMOJI} Ta komenda jest jeszcze dopracowywana!`,
    //     });
    //   }
    // }

    // Bot Permissions Check
    if (!message.guild.me.permissions.has(command.botPermissions || []))
      message.reply({
        content: `${process.env.FAILURE_EMOJI} Potrzebuje uprawnienia \`${
          cmd.botPermissions || []
        }\` aby wykonać tę komende`,
        ephemeral: true,
      });

    // Owner Only Commands
    if (command.ownerOnly) {
      if (!owners.includes(message.user.id)) {
        message.reply({
          content: `${process.env.FAILURE_EMOJI} Tylko właściciel bota może użyć tej komendy!`,
        });
      }
    }

    await command.run(client, message, args); // Running the Command
  }
});
