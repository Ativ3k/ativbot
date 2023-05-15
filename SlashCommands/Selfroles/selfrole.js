const {
  SelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: 'admin-selfrole',
  description: 'konfiguracja',
  userPermissions: 'Administrator',
  defaultMemberPermissions: 'Administrator',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: 'kategoria',
      type: ApplicationCommandOptionType.String,
      description: 'Wybierz kategorie',
      required: true,
      choices: [
        {
          name: '📺 Filmy',
          value: 'film',
          type: 1,
        },
        {
          name: '🎮 Gry',
          value: 'gry',
          type: 1,
        },
        {
          name: '📰 News',
          value: 'news',
          type: 1,
        },
        {
          name: '⚽ Sport',
          value: 'sport',
          type: 1,
        },
        {
          name: '📌 Województwa',
          value: 'wojewodztwa',
          type: 1,
        },
        {
          name: '👫 Płeć',
          value: 'plec',
          type: 1,
        },
        {
          name: '💻 Platforma',
          value: 'platforma',
          type: 1,
        },
        {
          name: '🔞 Wiek',
          value: 'wiek',
          type: 1,
        },
      ],
    },
    {
      name: 'channel',
      type: ApplicationCommandOptionType.Channel,
      description: 'Wybierz kanał',
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
    const kategorie = interaction.options.getString('kategoria');
    const cel = interaction.options.getChannel('channel');
    if (kategorie === 'news') {
      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('odcinek').setLabel('Nowy odcinek').setStyle('Secondary').setEmoji('🎥'),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('stream').setLabel('Stream').setStyle('Secondary').setEmoji('🎙️'),
        )
        .addComponents(new ButtonBuilder().setCustomId('film').setLabel('Film').setStyle('Secondary').setEmoji('📺'))
        .addComponents(new ButtonBuilder().setCustomId('ping').setLabel('Ping').setStyle('Secondary').setEmoji('🎺'));
      const embed = new EmbedBuilder()
        .setDescription(
          `**==================================\n` +
            `» Newsletter:\n` +
            `🎥 - <@&736448603194785884> \n` +
            `🎙️ - <@&736448602083426376> \n` +
            `📺 - <@&736448596752203866> \n` +
            `🎺 - <@&736448578800582786> \n` +
            `==================================**`,
        )
        .setColor('#0099E1');
      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'gry') {
      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setAuthor({ name: 'Wybierz gry.' })
        .setDescription(
          '**`UWAGA!`**\n**`(!)`** Możesz wybrać maksymalnie 8 ról. \n**`(!)`** Żeby usunąć wszystkie role wybierz opcje **<:trash:977556508499935262> `WYCZYŚĆ`**.\n',
        );

      const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('gry')
          .setPlaceholder('Wybierz gre')
          .addOptions([
            {
              label: 'Minecraft',
              value: '970797823987699773',
              emoji: '702728486187434085',
            },
            {
              label: 'CS-GO',
              value: '736455324206104640',
              emoji: '702729010962235414',
            },
            {
              label: 'Valorant',
              value: '736455337904832612',
              emoji: '914503434865115137',
            },
            {
              label: 'Call Of Duty',
              value: '736455359014764674',
              emoji: '872096534823579678',
            },
            {
              label: 'Battlefield',
              value: '736455355768242237',
              emoji: '872096534664208424',
            },
            {
              label: 'GTA',
              value: '736455320796266550',
              emoji: '872096537516318781',
            },
            {
              label: 'PUBG',
              value: '736455334838796289',
              emoji: '872096550883561544',
            },
            {
              label: 'Fortnite',
              value: '736455331672227910',
              emoji: '872096535607935066',
            },
            {
              label: 'Apex Legends',
              value: '872091864994566184',
              emoji: '872096534710353930',
            },
            {
              label: 'Rust',
              value: '872092402146504734',
              emoji: '872096551814721536',
            },
            {
              label: 'Rainbow Six Siege',
              value: '736455328149012500',
              emoji: '872096541299572768',
            },
            {
              label: 'League of Legends',
              value: '736455343646703707',
              emoji: '872096551441399818',
            },
            {
              label: 'Rocket League',
              value: '872092714202697758',
              emoji: '872096552842309672',
            },
            {
              label: 'Dead by daylight',
              value: '872092763112505394',
              emoji: '872096538040623174',
            },
            {
              label: 'Osu!',
              value: '736455365415272560',
              emoji: '971873537658859531',
            },
            {
              label: 'Roblox',
              value: '872092550343835688',
              emoji: '872096535167524884',
            },
            {
              label: 'ETS2',
              value: '736455362122874941',
              emoji: '872096550044696586',
            },
            {
              label: 'FIFA',
              value: '872092817198043216',
              emoji: '872096535826034768',
            },
            {
              label: 'WYCZYŚĆ',
              value: '0',
              emoji: '977556508499935262',
              description: 'Usuwa wszystkie role gier.',
            },
          ]),
      );
      const send = { embeds: [embed], components: [row] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'film') {
      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('horror').setLabel('Horror').setStyle('Secondary').setEmoji('👻'),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('komedia').setLabel('Komedia').setStyle('Secondary').setEmoji('🤡'),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('thriller').setLabel('Thriller').setStyle('Secondary').setEmoji('🔪'),
        )
        .addComponents(new ButtonBuilder().setCustomId('akcja').setLabel('Akcja').setStyle('Secondary').setEmoji('🔫'));
      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setDescription(
          `**==================================\n` +
            `» Filmy:\n` +
            `👻 - <@&872140180365144105> \n` +
            `🤡 - <@&872140303887380520> \n` +
            `🔪 - <@&872140332714835968> \n` +
            `🔫 - <@&872140350846820354> \n` +
            `==================================**`,
        );

      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'sport') {
      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('pilkanozna').setLabel('Piłka nożna').setStyle('Secondary').setEmoji('⚽'),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('siatkowka').setLabel('Siatkówka').setStyle('Secondary').setEmoji('🏐'),
        )
        .addComponents(
          new ButtonBuilder().setCustomId('koszykowka').setLabel('Koszykówka').setStyle('Secondary').setEmoji('🏀'),
        )
        .addComponents(new ButtonBuilder().setCustomId('tenis').setLabel('Tenis').setStyle('Secondary').setEmoji('🎾'))
        .addComponents(
          new ButtonBuilder().setCustomId('mecz').setLabel('Mecz reprezentacji').setStyle('Secondary').setEmoji('🌐'),
        );
      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setDescription(
          `**==================================\n` +
            `» Sport:\n` +
            `⚽ - <@&872126954776707122> \n` +
            `🏐 - <@&872127173220257802> \n` +
            `🏀 - <@&872127126634131576> \n` +
            `🎾 - <@&872127212692836362> \n` +
            `🌐 - <@&872128387173457920> (newsletter)\n` +
            `==================================**`,
        );

      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'plec') {
      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setDescription(
          `**==================================**\n` +
            `**${emoji.KOBIETA} - <@&872148534315606027>\n` +
            `${emoji.MEZCZYZNA} - <@&872148505320357908>\n` +
            `${emoji.NIEZNANAPLEC} - <@&871906536748879873>**\n` +
            ` **==================================**`,
        )
        .setAuthor({ name: 'Wybierz płeć.' });

      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('kobieta')
            .setLabel('Kobieta')
            .setStyle('Danger')
            .setEmoji(`${emoji.KOBIETA}`),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('mezczyzna')
            .setLabel('Mężczyzna')
            .setStyle('Primary')
            .setEmoji(`${emoji.MEZCZYZNA}`),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('nieznanaplec')
            .setLabel('Nieznana płeć')
            .setStyle('Secondary')
            .setEmoji(`${emoji.NIEZNANAPLEC}`),
        );

      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'wojewodztwa') {
      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setAuthor({ name: 'Wybierz województwo.' })
        .setDescription(
          `**==================================**\n` +
            ` **1. <:dolnoslaskie:871880759525384192> <@&871894217289531462>\n` +
            ` 2. <:kujawskopomorskie:871880759936430171> <@&871894812134109204>\n` +
            ` 3. <:lubelskie:871880759756070922> <@&871894942983802911>\n` +
            ` 4. <:lubuskie:871880761249255444> <@&872173978880446564>\n` +
            ` 5. <:lodzkie:871880761811271681> <@&871895110139387914>\n` +
            ` 6. <:malopolskie:871880762176188418> <@&871896354455183400>\n` +
            ` 7. <:mazowieckie:871880762893430854> <@&871896422390317066>\n` +
            ` 8. <:opolskie:871880762339766282> <@&871896460311023616>\n` +
            ` 9. <:podkarpackie:871880762067132476> <@&871896483975290920>\n` +
            ` 10. <:podlaskie:871880761857413140> <@&871896507421442048>\n` +
            ` 11. <:pomorskie:871880762394284092> <@&871896531551264838>\n` +
            ` 12. <:slaskie:871880766102052874> <@&871896553223237652>\n` +
            ` 13. <:swietokrzyskie:871880761907744768> <@&871896572324102154>\n` +
            ` 14. <:warminskomazurskie:871880762041958431> <@&871896603852693575>\n` +
            ` 15. <:wielkopolskie:871880762302021634> <@&872175391643684925>\n` +
            ` 16. <:zachodniopomorskie:871880762125865001> <@&871896668398813259>\n` +
            ` 17. ${emoji.ZNAKZAPYTANIA} <@&871917216034062357>**\n` +
            `**==================================**`,
        );

      const button = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('wojewodztwa')
          .setPlaceholder('Wybierz województwo')
          .addOptions([
            {
              label: 'Dolnośląskie',
              value: '871894217289531462',
              emoji: '<:dolnoslaskie:871880759525384192>',
            },
            {
              label: 'Kujawsko-Pomorskie',
              value: '871894812134109204',
              emoji: '<:kujawskopomorskie:871880759936430171>',
            },
            {
              label: 'Lubelskie',
              value: '871894942983802911',
              emoji: '<:lubelskie:871880759756070922>',
            },
            {
              label: 'Lubuskie',
              value: '872173978880446564',
              emoji: '<:lubuskie:871880761249255444> ',
            },
            {
              label: 'Łódzkie',
              value: '871895110139387914',
              emoji: '<:lodzkie:871880761811271681>',
            },
            {
              label: 'Malopolskie',
              value: '871896354455183400',
              emoji: '<:malopolskie:871880762176188418>',
            },
            {
              label: 'Mazowieckie',
              value: '871896422390317066',
              emoji: '<:mazowieckie:871880762893430854>',
            },
            {
              label: 'Opolskie',
              value: '871896460311023616',
              emoji: '<:opolskie:871880762339766282>',
            },
            {
              label: 'Podkarpackie',
              value: '871896483975290920',
              emoji: '<:podkarpackie:871880762067132476>',
            },
            {
              label: 'Podlaskie',
              value: '871896507421442048',
              emoji: '<:podlaskie:871880761857413140>',
            },
            {
              label: 'Pomorskie',
              value: '871896531551264838',
              emoji: '<:pomorskie:871880762394284092>',
            },
            {
              label: 'Śląskie',
              value: '871896553223237652',
              emoji: '<:slaskie:871880766102052874>',
            },
            {
              label: 'Świetokrzyskie',
              value: '871896572324102154',
              emoji: '<:swietokrzyskie:871880761907744768>',
            },
            {
              label: 'Warmińsko-Mazurskie',
              value: '871896603852693575',
              emoji: '<:warminskomazurskie:871880762041958431>',
            },
            {
              label: 'Wielkopolskie',
              value: '872175391643684925',
              emoji: '<:wielkopolskie:871880762302021634>',
            },
            {
              label: 'Zachodniopomorskie',
              value: '871896668398813259',
              emoji: '<:zachodniopomorskie:871880762125865001>',
            },
            {
              label: 'Nieznane województwo',
              value: '871917216034062357',
              emoji: `${emoji.ZNAKZAPYTANIA}`,
            },
          ]),
      );
      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'platforma') {
      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setAuthor({ name: 'Wybierz platforme.' })
        .setDescription(
          `**==================================\n` +
            `<:windows:871121370862485574> - <@&728828920186667008> \n` +
            `<:linux:871121368622710814> - <@&871122330078818354> \n` +
            `<:android:871121366106124328> - <@&728852717274923018> \n` +
            `<:iOS:871124215472979978> - <@&728852721016242267> \n` +
            `<:playstation:871121372162715650> - <@&728828941883932764> \n` +
            `<:xbox:971291545133269043> - <@&728828937097969726> \n` +
            `<:nintendo:871121368337498122> - <@&728828944060776508> \n` +
            `<:macos:943697995680084028> - <@&943697608688402482>\n` +
            `==================================**`,
        );

      const button = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('platforma')
          .setPlaceholder('Wybierz platforme')
          .addOptions([
            {
              label: 'Windows',
              value: '728828920186667008',
              emoji: '<:windows:871121370862485574>',
            },
            {
              label: 'Linux',
              value: '871122330078818354',
              emoji: '<:linux:871121368622710814>',
            },
            {
              label: 'macOS',
              value: '943697608688402482',
              emoji: '<:macos:943697995680084028>',
            },
            {
              label: 'Xbox',
              value: '728828937097969726',
              emoji: '<:xbox:971291545133269043> ',
            },
            {
              label: 'Playstation',
              value: '728828941883932764',
              emoji: '<:playstation:871121372162715650>',
            },
            {
              label: 'Nintendo',
              value: '728828944060776508',
              emoji: '<:nintendo:871121368337498122>',
            },
            {
              label: 'Android',
              value: '728852717274923018',
              emoji: '<:android:871121366106124328>',
            },
            {
              label: 'iOS',
              value: '728852721016242267',
              emoji: '<:iOS:871124215472979978>',
            },
          ]),
      );
      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }

    if (kategorie === 'wiek') {
      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('13')
            .setLabel('+13')
            .setStyle('Secondary')
            .setEmoji('<:13:870819230344417300>'),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('16')
            .setLabel('+16')
            .setStyle('Secondary')
            .setEmoji('<:16:870796293780434984>'),
        )
        .addComponents(new ButtonBuilder().setCustomId('18').setLabel('+18').setStyle('Danger').setEmoji('🔞'))
        .addComponents(
          new ButtonBuilder()
            .setCustomId('?')
            .setLabel('Nieznany wiek')
            .setStyle('Secondary')
            .setEmoji(`${emoji.ZNAKZAPYTANIA}`),
        );

      const embed = new EmbedBuilder()
        .setColor('#0099E1')
        .setDescription(
          `**==================================\n` +
            `<:13:870819230344417300> - <@&870796969424072737> \n` +
            `<:16:870796293780434984> - <@&870797338124361739> \n` +
            `${emoji.ZNAKZAPYTANIA}  - <@&871917132118638592>\n==================================**`,
        );
      const send = { embeds: [embed], components: [button] };
      cel.send(send);
      interaction.reply(`**Sukces! Wysłano na:** ${cel}`);
    }
  },
};
