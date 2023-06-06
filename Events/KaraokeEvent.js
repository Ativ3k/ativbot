const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const client = require('../index');

client.on('interactionCreate', async (interaction) => {
  const CategoryId = '704789389544521859';
  const StaffRoleId = '1015294993230991360';
  const EveryoneRoleId = '639632749610795009';

  if (interaction.customId === 'event-open') {
    if (interaction.guild.channels.cache.find((e) => e.topic === interaction.user.id)) {
      const otwarty = interaction.guild.channels.cache.find((e) => e.topic === interaction.user.id);
      return interaction.reply({
        content: `:warning: **\`Posiadasz już otwarty ticket!\`** \n:arrow_right: **\`Kliknij aby przejść:\`** <#${otwarty}> `,
        ephemeral: true,
      });
    }

    interaction.guild.channels
      .create({
        name: `event-${interaction.user.username}`,
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
      })
      .then(async (c) => {
        interaction.reply({
          content: `<a:success:976092115119534150> **\`Ticket utworzony!\`** \n:arrow_right: **\`Kliknij aby przejść:\`** <#${c.id}>`,
          ephemeral: true,
        });

        const newtic = new EmbedBuilder()
          .setColor('#FFB808')
          .setDescription(
            `Cześć! 👋\n\n` +
              `Podeślij nam link do piosenki którą chcesz zaśpiewać na <@&995107477232304188>.\n` +
              `Po wysłaniu poczekaj aż nasza seksowna moderatorka <@854382620350742549> zatwierdzi utwór i nada Ci role <@&995107477232304188>.\n\n` +
              `\`Prosimy zachować wszystko w granicy dobrego smaku, w przeciwnym wypadku zapis na karaoke zostanie odrzucony.\``,
          )
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('event-close').setLabel('Zamknij ticket').setStyle('Danger'),
        );
        c.send({
          content: `Hej <@${interaction.user.id}>! (<@&${StaffRoleId}>)`,
          embeds: [newtic],
          components: [row],
        }).then((msg) => msg.pin());
      });
  } else if (interaction.customId === 'event-close') {
    await interaction.deferUpdate();

    const row = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId('event-reopen').setLabel('🔓 Otwórz').setStyle('Success'))
      .addComponents(new ButtonBuilder().setCustomId('event-delete').setLabel('❌ Usuń').setStyle('Danger'));

    const embedclosedtic = new EmbedBuilder().setColor('Orange').setDescription('**`Zamykanie ticketu...`**');

    const embedclosed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`🔒 **\`Pomyślnie zamknięto ticket przez\`** <@${interaction.user.id}>`);
    const confirmed = await interaction.channel.send({
      embeds: [embedclosedtic],
    });
    await confirmed.then;

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
  } else if (interaction.customId === 'event-reopen') {
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
    const embedreopen = new EmbedBuilder().setColor('Green').setDescription('**`Otwarto ticket ponownie!`**');
    await interaction.channel.send({ embeds: [embedreopen] });
  } else if (interaction.customId === 'event-delete') {
    const embedremove = new EmbedBuilder().setColor('Red').setDescription('**`Usuwanie ticketu...`**');
    interaction.channel.send({ embeds: [embedremove] });
    setTimeout(function deleteTicket() {
      interaction.channel.delete();
    }, 1000);
  }
  return 0;
});
