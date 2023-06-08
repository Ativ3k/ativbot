const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'kolor',
  description: 'Ustawia kolor',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  cooldown: 30,
  options: [
    {
      name: 'kolor',
      type: ApplicationCommandOptionType.String,
      description: 'Wybierz kolor',
      required: true,
      choices: [
        {
          name: '「🧡」Pomarańczowy',
          value: '728850863220719637',
          type: 1,
        },
        {
          name: '「💛」Żółty',
          value: '871901713370607677',
          type: 1,
        },
        {
          name: '「💚」Zielony',
          value: '728850853108383795',
          type: 1,
        },
        {
          name: '「💙」Niebieski',
          value: '728850856564228167',
          type: 1,
        },
        {
          name: '「💜」Fioletowy',
          value: '872069838221221948',
          type: 1,
        },
        {
          name: '「🌸」Różowy',
          value: '728850865968119869',
          type: 1,
        },
        {
          name: '「🤎」Brązowy',
          value: '871902042933841960',
          type: 1,
        },
        {
          name: '「🖤」Czarny',
          value: '728850848959954964',
          type: 1,
        },
        {
          name: '「🤍」Biały',
          value: '871902424506466344',
          type: 1,
        },
        {
          name: '「❌」Usuń kolor',
          value: '0',
          type: 1,
        },
      ],
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
    // const alllog = client.channels.cache.get("988342883138551828");
    // alllog.send({ content: `${emoji.INFO} ${interaction.member} używa **\`/${interaction.command.name}\`** na kanale ${interaction.channel}` })

    const memberR = interaction.member.roles;
    const kolory = [
      '728850863220719637',
      '871901713370607677',
      '728850853108383795',
      '728850856564228167',
      '872069838221221948',
      '728850865968119869',
      '871902042933841960',
      '728850848959954964',
      '871902424506466344',
    ];
    const choice = interaction.options.getString('kolor');
    if (choice === '0') {
      await memberR.remove(kolory);
      const reply = new EmbedBuilder()
        .setDescription(`Twój kolor został usunięty.`)
        .setColor(interaction.member.displayHexColor);
      return interaction.reply({ embeds: [reply], ephemeral: true });
    }
    await memberR.remove(kolory);
    await memberR.add(choice);
    const reply = new EmbedBuilder()
      .setDescription(`Wybrałeś kolor: <@&${choice}>`)
      .setColor(interaction.member.displayHexColor);

    await interaction.reply({ embeds: [reply] });

    return setTimeout(function sendLog() {
      const logs = client.channels.cache.get('969995573983838218');
      const logi = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.member.user.username}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setDescription(`${interaction.member} **wybrał kolor:** <@&${choice}>`)
        .setColor(interaction.member.displayHexColor);

      logs.send({ embeds: [logi] });
    }, 250);
  },
};
