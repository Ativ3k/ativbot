const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  name: 'rules',
  description: 'Rules.',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({
        name: 'DISCORD.GG/WIEMJAK',
        url: 'https://discord.gg/wiemjak',
      })
      .setThumbnail('https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless')
      .setDescription(
        'Przestrzegamy Discord ToS oraz Wytycznych dla spoleczności.\n' +
          '[Discord Terms of Service](https://discord.com/terms)\n' +
          '[Discord Community Guidelines](https://discord.com/guidelines)\n\n' +
          'Jeżeli masz jakieś pytania/problemy to śmiało pisz do <@258891606873210880> lub otwórz ticket na kanale <#704789562421149776>.',
      )
      .addFields(
        {
          name: 'Zasada 1 - Zakaz spamu lub reklamowania',
          value: 'Nie zezwalamy na jakikolwiek spam lub reklamowanie na serwerze lub w wiadomościach prywatnych.',
          inline: false,
        },
        {
          name: 'Zasada 2 - Szanuj innych',
          value:
            'Szanujmy siebie nawzajem i nie obrażajmy innych użytkowników. Nie tolerujemy osób które nie odnoszą sie do innych z szacunkiem i powodują konflikty.' +
            ' Wiadomo, każdemu zdarzy sie jakaś spina ale wszystko z umiarem, dogadujmy sie z wzajemnym szacunkiem.',
          inline: false,
        },
        {
          name: 'Zasada 3 - Zakaz niepoprawnych nicków lub podszywania się',
          value:
            'Twój nick nie może być wulgarny, niewidoczny, trudny do oznaczenia. Podszywanie się pod administracje/boty skutkuje banem. Również awatar nie może być wulgarny/niewidoczny.',
          inline: false,
        },
        {
          name: 'Zasada 4 - Kanały tekstowe',
          value:
            'Starajmy się utrzymywać tematyke kanału. W przypadku gdy użytkownik nagminnie łamie tematyke kanału, może zostać ukarany.',
          inline: false,
        },
        {
          name: 'Zasada 5 - Kanały głosowe',
          value:
            'Stanowczy zakaz puszczania bindów/muzyki, obrażania innych, przekrzykiwania, przedrażniania. Od muzyki mamy boty muzyczne. ' +
            'Na kanałach utworzonych przez generator właściciel kanału ma pełne prawo do zarządzania kanału przez komende **`/vc`** lub przez <#956091358353981470>.\n__Administracja ma immunitet.__',
          inline: false,
        },
        {
          name: 'Zasada 6 - Administracja moderuje według własnego uznania',
          value:
            'Na serwerze każdy członek administracji podchodzi indywidualnie do każdej sprawy i w przypadku gdy nakłada kare to jest ona wymierzona według jego uznania. ' +
            'Jedne przewinienia mogą skończyć się upomnieniem a inne banem.\n' +
            'Bądzcie grzeczni! Nie mamy rozpiski jaką kare i na ile można dostać za dane przewinienie, wszystko zależy od tego jak bardzo nabroicie;)\n\n' +
            'Jeżeli widzisz że ktoś łamie zasady możesz to zgłosić\ndo osoby z rangą <@&871190767098540032>\nlub na kanale <#704789562421149776>.',
          inline: false,
        },
      )
      .setTimestamp()
      .setFooter({
        text: 'REGULAMIN SERWERA WIEMJAK',
        iconURL: 'https://cdn.discordapp.com/emojis/799293464302452779.png?size=4096&quality=lossless',
      });

    interaction.channel.send({ embeds: [embed] });
  },
};
