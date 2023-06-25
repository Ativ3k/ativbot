const { ActionRowBuilder, ButtonBuilder, WebhookClient, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
require('dotenv').config();

// Konfiguracja bota jest przechowywana w mongoDB.
// Wygląda następująco:
//   const mongoose = require('mongoose');
//   const Schema = new mongoose.Schema({
//      guildId: String,        <= ID serwera
//      adminchannelid: String, <= ID kanału do weryfikacji
//      anonwebhook: String,   <= Link do webhook
//      anonimchannel: String, <= ID kanału głównego z anonimami
//   });
//   module.exports = mongoose.model("anonim", Schema);
const anonim = require('../../Models/anonimSchema');

client.on('modalSubmit', async (modal) => {
  /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// //////
  // Anonim, komenda = anonimv3
  /// /////
  if (modal.customId === 'anonmodal') {
    //  Przyciski POTWIERDŹ/ODRZUĆ które są na kanale weryfikacyjnym
    const anonimButtons = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId('wyslij').setLabel('Potwierdź').setStyle('Success'))
      .addComponents(new ButtonBuilder().setCustomId('usun').setLabel('Odrzuć').setStyle('Danger'));
    // Ustalenie treści anonima
    const anonimContent = modal.getTextInputValue('anontresc');

    // Wiadomość embed zatwierdzonego anonima.
    const anonimAdded = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Treść:')
      .setAuthor({
        name: 'Anonim',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        url: 'https://discord.gg/wiemjak',
      })
      .setDescription(anonimContent)
      .setTimestamp()
      .setFooter({
        text: 'Anonim 3.0 | Wyślij swojego anonima komendą /anonim',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });

    // Wiadomość embed zwrotna w przypadku odrzucenia anonima.
    const anonimRejected = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Treść:')
      .setAuthor({
        name: 'Anonim',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        url: 'https://discord.gg/wiemjak',
      })
      .setDescription(
        `${emoji.FAILURE} **Twój anonim został odrzucony przyjacielu.** ${emoji.PepeSadge}\n**Treść:**\n${anonimContent}`,
      )
      .setTimestamp()
      .setFooter({
        text: 'Anonim 3.0 | Anonimowa wiadomość',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });

    // Wiadomość embed z treścią anonima.
    const anonimEmbed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Treść:')
      .setAuthor({
        name: 'Anonim',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        url: 'https://discord.gg/wiemjak',
      })
      .setDescription(anonimContent)
      .setTimestamp()
      .setFooter({
        text: 'Anonim 3.0 | Anonimowa wiadomość',
        iconURL: 'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });

    // Opóźnienie odpowiedzi
    await modal.deferReply({ ephemeral: true });

    // Kontynuacja odpowiedzi
    modal.followUp({
      // Wiadomość potwierdzająca pomyślne wysłanie anonima. "Ephemeral: true" oznacza że tylko my widzimy to potwierdzenie.
      embeds: [anonimEmbed],
      content: 'Twój anonim został wysłany do weryfikacji!',
      ephemeral: true,
    });
    // Skrócenie "client.users.cache.get(modal.user.id)" do krótszego "autor"
    const autor = modal.member;

    // Szukanie konfiguracji kanału z anonimami, zatwierdzeniami anonima i webhook na podstawie ID serwera na którym została użyta komenda.
    const anonimSettings = await anonim.findOne({
      guildId: modal.guild.id,
    });
    // Odniesienie sie do wartości które uzyskaliśmy wyżej
    if (anonimSettings) {
      // Wiadomość embed zwrotna w przypadku przyjęcia anonima.
      const zwrot = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Treść:')
        .setAuthor({
          name: 'Anonim',
          iconURL:
            'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
          url: 'https://discord.gg/wiemjak',
        })
        .setTitle('Kliknij aby przejść na kanał')
        .setURL(`https://discord.com/channels/${anonimSettings.guildId}/${anonimSettings.anonimchannel}`)
        .setDescription(
          `${emoji.SUCCESS} **Twój anonim został dodany!** ${emoji.pepeshhh}\n**Treść:**\n${anonimContent}`,
        )
        .setTimestamp()
        .setFooter({
          text: 'Anonim 3.0 | Anonimowa wiadomość',
          iconURL:
            'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        });

      // Ustalenie kanału administracyjnego czyli tam gdzie zatwierdzamy.
      const admin = client.channels.cache.get(anonimSettings.adminchannelid);
      // Wysłanie anonima na kanał administracyjny z przyciskami POTWIERDŹ/ODRZUĆ.
      const message = await admin.send({
        content: `<@&871190767098540032>`,
        embeds: [anonimEmbed],
        components: [anonimButtons],
      });
      const filter = (button) => button.clicker.user.id === message.member.id;
      // Collector - czyli bot czeka na decyzje administracji.
      // Ze względu na to że bot nie ma bazy danych anonimów każdy reset bota czy też jego awaria powoduje że collector zaczyna prace od nowa a więc zapomina niezatwierdzone anonimy.
      // Wtedy anonim musi zostać wysłany ponownie lub może zostać zatwierdzony bez informacji zwrotnej.
      const collector = message.createMessageComponentCollector(filter, {
        time: 0,
      });

      collector.on('collect', async (interaction) => {
        // Przycisk który dodawany jest na kanale weryfikacyjnym w przypadku zatwierdzenia anonima.
        const dodanybutton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(`Zatwierdzony przez: ${interaction.member.user.username}`)
            .setCustomId('zaakceptowanyprzez')
            .setStyle('Success')
            .setDisabled(true),
        );

        // Przycisk który dodawany jest na kanale weryfikacyjnym w przypadku odrzucenia anonima.
        const usunietybutton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(`Odrzucony przez: ${interaction.member.user.username}`)
            .setCustomId('odrzuconyprzez')
            .setStyle('Danger')
            .setDisabled(true),
        );

        //  Co sie dzieje kiedy anonim jest usunięty
        if (interaction.customId === 'usun') {
          // Wiadomość zwrotna do autora o odrzuceniu anonima.
          autor
            .send({
              embeds: [anonimRejected],
            })
            .then(
              // Edytowanie wiadomości na kanale weryfikacyjnym i zamiana przycisków POTWIERDŹ/ODRZUĆ na "Odrzucony przez: NICK"
              anonimEmbed.setColor('Red'),
              interaction.update({
                embeds: [anonimEmbed],
                components: [usunietybutton],
              }),
            );
        }
        if (interaction.customId === 'wyslij') {
          // Ustalenie kanału głównego z anonimami z konfiguracji bota
          const anonimChannel = client.channels.cache.get(anonimSettings.anonimchannel);
          // Ustalenie webhooka z konfiguracji bota
          const webhookClient = new WebhookClient({
            url: anonimSettings.anonwebhook,
          });
          // Wysłanie anonima poprzez webhook na kanał główny.
          webhookClient
            .send({
              username: 'Anonim',
              avatarURL:
                'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.jpg?size=1024',
              embeds: [anonimAdded],
            })
            // Wiadomość zwrotna do autora o dodaniu anonima.
            .then(() => {
              // Przechwycenie wiadomości dodanych z głównego kanału z anonimami.
              anonimChannel.messages.fetch({ limit: 1 }).then((messages) => {
                // Ostatnia wiadomość = pierwsza wiadomość.
                const lastMessage = messages.first();
                // Dodanie reakcji 👍/👎 pod anonimem.
                lastMessage.react('👍');
                lastMessage.react('👎');
                // Utworzenie wątku pod anonimem
                lastMessage.startThread({
                  name: `Komentarze`,
                  autoArchiveDuration: 10080,
                  type: 'GUILD_PUBLIC_THREAD',
                });
              });
            })
            .then(
              autor.send({
                embeds: [zwrot],
              }),
            )
            .then(
              // Edytowanie wiadomości na kanale weryfikacyjnym i zamiana przycisków POTWIERDŹ/ODRZUĆ na "Zatwierdzony przez: NICK"
              anonimAdded.setColor('Green'),
              interaction.update({
                embeds: [anonimAdded],
                components: [dodanybutton],
              }),
            );
        }
      });
    }
  }
});
