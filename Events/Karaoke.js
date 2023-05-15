const client = require('../index');
const emoji = require('../json/emoji.json');

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === 'karaoke') {
    const rola = '995107477232304188';
    const hasRole = interaction.member.roles.cache.has(rola);
    const memberRoles = interaction.member.roles;
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else if (hasRole) {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
});
