const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'ecohelp',
  description: 'Informacje o ekonomii.',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction) => {
    const voice =
      `${emoji.karaoke} **Spędzanie czasu na kanałach głosowych**\n` +
      `**__Warunki:__**\n` +
      `**•** \`Musisz spędzić na VC przynajmniej 5 sekund będąc odciszonym\`\n` +
      `**•** \`Nie możesz być wyciszony\`\n` +
      `**•** \`Na kanale musi być inny członek (BOTy nie są wliczane!)\``;

    const txt =
      `:writing_hand:  **Pisanie wiadomości tekstowych**\n` +
      `**__Warunki:__**\n` +
      `**•** \`Wiadomość musi mieć conajmniej 10 znaków\`\n` +
      `**•** \`Odstęp pomiędzy nową a starą wiadomością musi być większy niż 15 sekund\``;

    const memiki =
      `:clown: **Dobry mem na <#643939849015132160>**\n` +
      `**__Warunki:__**\n` +
      `**•** \`Mem musi mieć conajmniej 11 reakcji\`${emoji.TAK}`;

    const embed = new EmbedBuilder()
      .setDescription(`Hej! 👋\n Obecnie ${emoji.jascoin} otrzymać można za:\n\n${voice}\n\n${txt}\n\n${memiki}`)
      .setColor('#FFFFFF')
      .setFooter({
        text: `JaśCoinEco, Made In Kanciapa Ativa`,
        iconURL: `https://media.discordapp.net/attachments/688463526586482785/1023374577314836512/jascoin.png`,
      });

    interaction.reply({ embeds: [embed] });
  },
};
