const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const client = require('../index'); // Importing Client from Index.js
const weryfikacja18 = require('../Models/TicketPanel');

client.on('interactionCreate', async (interaction) => {
  const weryfikacja = await weryfikacja18.findOne({
    guildId: interaction.guild.id,
  });

  const EveryoneRoleId = weryfikacja.everyone;
  const StaffRoleId = weryfikacja.staff;
  const CategoryId = weryfikacja.category;

  if (interaction.customId === 'ticket-open') {
    if (interaction.guild.channels.cache.find((e) => e.topic === interaction.user.id)) {
      const otwarty = interaction.guild.channels.cache.find((e) => e.topic === interaction.user.id);
      return interaction.reply({
        content: `:warning: **\`Posiadasz już otwarty ticket!\`** \n:arrow_right: **\`Kliknij aby przejść:\`** <#${otwarty}> `,
        ephemeral: true,
      });
    }

    const verifyChannel = await interaction.guild.channels.create({
      name: `Weryfikacja-${interaction.user.username}`,
      parent: CategoryId,
      topic: interaction.user.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
        },
        {
          id: StaffRoleId,
          allow: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
        },
        {
          id: EveryoneRoleId,
          deny: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
        },
      ],
    });

    interaction.reply({
      content: `<a:success:976092115119534150> **\`Ticket utworzony!\`** \n:arrow_right: **\`Kliknij aby przejść:\`** <#${verifyChannel.id}>`,
      ephemeral: true,
    });

    const newTicket = new EmbedBuilder()
      .setAuthor({
        name: 'Informacje o weryfikacji.',
        iconURL: 'https://cdn.discordapp.com/emojis/968502676042170409.webp?size=96&quality=lossless',
        url: 'https://discord.gg/wiemjak',
      })
      .setColor('#FFB808')
      .setDescription(
        'Cześć! Wyślij swoje zdjęcie i cierpliwie poczekaj na odpowiedź!\nPo przejściu weryfikacji ten kanał zostanie usunięty **`na zawsze`**.\n\n**`Zdjęcie przykładowe:`**',
      )
      .setImage('https://cdn.discordapp.com/attachments/872072431295164416/943992178030542898/18plus.png')
      .setTimestamp()
      .setFooter({
        text: 'Weryfikacja +18',
        iconURL: 'https://cdn.discordapp.com/emojis/968502676042170409.webp?size=96&quality=lossless',
      });

    const ticketButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket-close').setLabel('Zamknij ticket').setStyle('Danger'),
    );
    verifyChannel
      .send({
        content: `Hej <@${interaction.user.id}>! (<@&${StaffRoleId}>)`,
        embeds: [newTicket],
        components: [ticketButtons],
      })
      .then((msg) => msg.pin());
  }
  if (interaction.customId === 'ticket-close') {
    await interaction.deferUpdate();

    const row = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId('ticket-reopen').setLabel('🔓 Otwórz').setStyle('Success'))
      .addComponents(new ButtonBuilder().setCustomId('ticket-delete').setLabel('❌ Usuń').setStyle('Danger'));

    const embedClosedTicket = new EmbedBuilder().setColor('Orange').setDescription('**`Zamykanie ticketu...`**');

    const embedclosed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`🔒 **\`Pomyślnie zamknięto ticket przez\`** <@${interaction.user.id}>`);
    const confirmed = await interaction.channel.send({
      embeds: [embedClosedTicket],
    });

    setTimeout(function closeTicket() {
      interaction.channel.permissionOverwrites.set([
        {
          id: StaffRoleId,
          allow: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
        },
        {
          id: EveryoneRoleId,
          deny: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
        },
      ]);
      confirmed.edit({ embeds: [embedclosed], components: [row] });
    }, 500);
  } else if (interaction.customId === 'ticket-reopen') {
    const user = await client.users.fetch(interaction.channel.topic);
    interaction.channel.permissionOverwrites.set([
      {
        id: user.id,
        allow: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
      },
      {
        id: StaffRoleId,
        allow: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
      },
      {
        id: EveryoneRoleId,
        deny: ['SendMessages', 'ViewChannel', 'AttachFiles', 'ReadMessageHistory'],
      },
    ]);
    interaction.channel.messages.fetch({ limit: 1 }).then((messages) => {
      const lastMessage = messages.first();
      lastMessage.delete();
    });
    const embedReopen = new EmbedBuilder().setColor('Green').setDescription('**`Otwarto ticket ponownie!`**');
    interaction.channel.send({ embeds: [embedReopen] });
  } else if (interaction.customId === 'ticket-delete') {
    const embedRemove = new EmbedBuilder().setColor('Red').setDescription('**`Usuwanie ticketu...`**');
    interaction.channel.send({ embeds: [embedRemove] });
    setTimeout(() => {
      interaction.channel.delete();
    }, 1000);
  }
  return 0;
});
