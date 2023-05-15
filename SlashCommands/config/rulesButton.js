const {
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'rulesaccept',
  description: 'RulesAccept.',
  userPermissions: 'Administrator',
  defaultMemberPermissions: 'Administrator',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'channel',
      type: ApplicationCommandOptionType.Channel,
      channel_types: [0],
      description: 'Kanał z akceptacją zasad.',
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const choice = interaction.options.getChannel('channel');
    const targetId = client.channels.cache.get(choice.id);
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`Na kanał ${targetId} została wysłana akceptacja zasad!`);

    const accept = new EmbedBuilder()
      .setColor('Green')
      .setDescription('**`Klikając przycisk poniżej akceptujesz regulamin.`**');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('rulesaccept')
        .setLabel('Akceptuje regulamin')
        .setEmoji(`${emoji.SUCCESS}`)
        .setStyle('Success'),
    );

    interaction.reply({ embeds: [embed], ephemeral: true });

    targetId.send({ embeds: [accept], components: [row] });
  },
};
