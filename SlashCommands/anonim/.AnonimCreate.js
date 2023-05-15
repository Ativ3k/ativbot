const {
  ActionRowBuilder,
  ButtonBuilder,
  WebhookClient,
  EmbedBuilder,
} = require('discord.js');
const client = require('../../index');
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
    //  Przyciski POTWIERDŹ/USUŃ które są na kanale weryfikacyjnym
    const anonbuttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('wyslij')
          .setLabel('Potwierdź')
          .setStyle('Success'),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('usun')
          .setLabel('Usuń')
          .setStyle('Danger'),
      );
    // Ustalenie treści anonima
    const trescanonim = modal.getTextInputValue('anontresc');

    // Wiadomość embed zatwierdzonego anonima.
    const dodany = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Treść:')
      .setAuthor({
        name: 'Anonim',
        iconURL:
          'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        url: 'https://discord.gg/wiemjak',
      })
      .setDescription(trescanonim)
      .setTimestamp()
      .setFooter({
        text: 'Anonim 3.0 | Wyślij swojego anonima komendą /anonim',
        iconURL:
          'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });

    // Wiadomość embed zwrotna w przypadku odrzucenia anonima.
    const odrzucony = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Treść:')
      .setAuthor({
        name: 'Anonim',
        iconURL:
          'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        url: 'https://discord.gg/wiemjak',
      })
      .setDescription(
        `<:failed:976683070516244490> **Twój anonim został odrzucony przyjacielu.** <:PepeSadge:968540658866483270>\n**Treść:**\n${trescanonim}`,
      )
      .setTimestamp()
      .setFooter({
        text: 'Anonim 3.0 | Anonimowa wiadomość',
        iconURL:
          'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });

    // Wiadomość embed z treścią anonima.
    const embedanonim = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Treść:')
      .setAuthor({
        name: 'Anonim',
        iconURL:
          'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        url: 'https://discord.gg/wiemjak',
      })
      .setDescription(trescanonim)
      .setTimestamp()
      .setFooter({
        text: 'Anonim 3.0 | Anonimowa wiadomość',
        iconURL:
          'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
      });

    // Opóźnienie odpowiedzi
    await modal.deferReply({ ephemeral: true });

    // Kontynuacja odpowiedzi
    modal.followUp({
      // Wiadomość potwierdzająca pomyślne wysłanie anonima. "Ephemeral: true" oznacza że tylko my widzimy to potwierdzenie.
      embeds: [embedanonim],
      content: 'Twój anonim został wysłany do weryfikacji!',
      ephemeral: true,
    });
    // Skrócenie "client.users.cache.get(modal.user.id)" do krótszego "autor"
    autor = client.users.cache.get(modal.user.id);

    // Szukanie konfiguracji kanału z anonimami, zatwierdzeniami anonima i webhook na podstawie ID serwera na którym została użyta komenda.
    const anonimek = await anonim.find({
      guildId: modal.guild.id,
    });

    // Odniesienie sie do wartości które uzyskaliśmy wyżej
    for (const anon of anonimek) {
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
        .setURL(
          `https://discord.com/channels/${anon.guildId}/${anon.anonimchannel}`,
        )
        .setDescription(
          `<a:success:976092115119534150> **Twój anonim został dodany!** <:pepeshhh:968543360627396628>\n**Treść:**\n${trescanonim}`,
        )
        .setTimestamp()
        .setFooter({
          text: 'Anonim 3.0 | Anonimowa wiadomość',
          iconURL:
            'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.png?size=1024',
        });

      // Ustalenie kanału administracyjnego czyli tam gdzie zatwierdzamy.
      const admin = client.channels.cache.get(anon.adminchannelid);
       // Wysłanie anonima na kanał administracyjny z przyciskami POTWIERDŹ/USUŃ.
    const message = admin
        .send({
         
          content: `<@&871190767098540032>`,
          embeds: [embedanonim],
          components: [anonbuttons],
        })
          const filter = (button) =>
            button.clicker.user.id === message.member.id;
          // Collector - czyli bot czeka na decyzje administracji.
          // Ze względu na to że bot nie ma bazy danych anonimów każdy reset bota czy też jego awaria powoduje że collector zaczyna prace od nowa a więc zapomina niezatwierdzone anonimy.
          // Wtedy anonim musi zostać wysłąny ponownie lub może zostać zatwierdzony bez informacji zwrotnej.
          const collector = message.createMessageComponentCollector(filter, {
            time: 0,
          });

          collector.on('collect', async (interaction) => {
            // Przycisk który dodawany jest na kanale weryfikacyjnym w przypadku zatwierdzenia anonima.
            const dodanybutton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel(`Zatwierdzony przez: ${interaction.member.user.tag}`)
                .setCustomId('zaakceptowanyprzez')
                .setStyle('Success')
                .setDisabled(true),
            );

            // Przycisk który dodawany jest na kanale weryfikacyjnym w przypadku odrzucenia anonima.
            const usunietybutton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel(`Odrzucony przez: ${interaction.member.user.tag}`)
                .setCustomId('odrzuconyprzez')
                .setStyle('Danger')
                .setDisabled(true),
            );

            //  Co sie dzieje kiedy anonim jest usunięty
            if (interaction.customId === 'usun') {
              // Wiadomość zwrotna do autora o odrzuceniu anonima.
              autor
                .send({
                  embeds: [odrzucony],
                })
                .then(
                  // Edytowanie wiadomości na kanale weryfikacyjnym i zamiana przycisków POTWIERDŹ/USUŃ na "Odrzucony przez: NICK#0000"
                  embedanonim.setColor('Red'),
                  interaction.update({
                    embeds: [embedanonim],
                    components: [usunietybutton],
                  }),
                );
            }
            if (interaction.customId === 'wyslij') {
              // Ustalenie kanału głównego z anonimami z konfiguracji bota
              const anonimowe = client.channels.cache.get(anon.anonimchannel);
              // Ustalenie webhooka z konfiguracji bota
              const webhookClient = new WebhookClient({
                url: anon.anonwebhook,
              });
              // Wysłanie anonima poprzez webhook na kanał główny.
              webhookClient
                .send({
                  username: 'Anonim',
                  avatarURL:
                    'https://cdn.discordapp.com/avatars/935973936867467264/d43e78a49aa68767beebb3ef258d6ed2.jpg?size=1024',
                  embeds: [dodany],
                })
                // Wiadomość zwrotna do autora o dodaniu anonima.
                .then(() => {
                  // Przechwycenie wiadomości dodanych z głównego kanału z anonimami.
                  anonimowe.messages.fetch({ limit: 1 }).then((messages) => {
                    // Ostatnia wiadomość = pierwsza wiadomość.
                    const lastMessage = messages.first();
                    // Dodanie reakcji 👍/👎 pod anonimem.
                    lastMessage.react('👍'),
                      lastMessage.react('👎'),
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
                  // Edytowanie wiadomości na kanale weryfikacyjnym i zamiana przycisków POTWIERDŹ/USUŃ na "Zatwierdzony przez: NICK#0000"
                  dodany.setColor('Green'),
                  interaction.update({
                    embeds: [dodany],
                    components: [dodanybutton],
                  }),
                );
            }
          });
        }
};
