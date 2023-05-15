const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/KaraokeSchema');

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === 'karaokevote1') {
    const checkuser = await db.findOne({
      messid: interaction.message.id,
      vote1: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na ⭐!',
        ephemeral: true,
      });
    const data = await db.findOne({ messid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          vote2: interaction.member.id,
          vote3: interaction.member.id,
          vote4: interaction.member.id,
          vote5: interaction.member.id,
        },
        $push: {
          vote1: interaction.member.id,
        },
      });
    }

    const dataedit = await db.findOne({ messid: interaction.message.id });
    const msg = interaction.message;
    const vote1 = dataedit.vote1.length * 1;
    const vote2 = dataedit.vote2.length * 2;
    const vote3 = dataedit.vote3.length * 3;
    const vote4 = dataedit.vote4.length * 4;
    const vote5 = dataedit.vote5.length * 5;

    const totalvote =
      dataedit.vote1.length +
      dataedit.vote2.length +
      dataedit.vote3.length +
      dataedit.vote4.length +
      dataedit.vote5.length;
    const avg = (vote1 + vote2 + vote3 + vote4 + vote5) / totalvote;
    const totalpkt = vote1 + vote2 + vote3 + vote4 + vote5;
    await data.updateOne({ total: totalpkt });

    let color;
    if (avg >= 4.25) {
      color = 'Green';
    }
    if (avg >= 3.8 && avg < 4.25) {
      color = '#C0FF00';
    }
    if (avg >= 3 && avg < 3.8) {
      color = 'Yellow';
    }
    if (avg >= 2 && avg < 3) {
      color = 'Orange';
    }
    if (avg >= 1 && avg < 2) {
      color = 'Red';
    }

    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐⭐ = ${dataedit.vote5.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐ = ${dataedit.vote4.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: '‎',
        value: `\`\`\`⭐⭐⭐ = ${dataedit.vote3.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐ = ${dataedit.vote2.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐ = ${dataedit.vote1.length || 0}\`\`\``,
        inline: false,
      },
    );
    embed.setColor(`${color}`);
    embed.setFooter({
      text: `Średnia: ${avg.toFixed(2)} // Łączne: ${totalpkt}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
    });

    msg.edit({ embeds: [embed] });

    const reply = new EmbedBuilder().setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na ⭐`).setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'karaokevote2') {
    const checkuser = await db.findOne({
      messid: interaction.message.id,
      vote2: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na ⭐⭐!',
        ephemeral: true,
      });

    const data = await db.findOne({ messid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          vote1: interaction.member.id,
          vote3: interaction.member.id,
          vote4: interaction.member.id,
          vote5: interaction.member.id,
        },
        $push: {
          vote2: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messid: interaction.message.id });
    const msg = interaction.message;
    const vote1 = dataedit.vote1.length * 1;
    const vote2 = dataedit.vote2.length * 2;
    const vote3 = dataedit.vote3.length * 3;
    const vote4 = dataedit.vote4.length * 4;
    const vote5 = dataedit.vote5.length * 5;

    const totalvote =
      dataedit.vote1.length +
      dataedit.vote2.length +
      dataedit.vote3.length +
      dataedit.vote4.length +
      dataedit.vote5.length;
    const avg = (vote1 + vote2 + vote3 + vote4 + vote5) / totalvote;
    const totalpkt = vote1 + vote2 + vote3 + vote4 + vote5;
    await data.updateOne({ total: totalpkt });

    let color;
    if (avg >= 4.25) {
      color = 'Green';
    }
    if (avg >= 3.8 && avg < 4.25) {
      color = '#C0FF00';
    }
    if (avg >= 3 && avg < 3.8) {
      color = 'Yellow';
    }
    if (avg >= 2 && avg < 3) {
      color = 'Orange';
    }
    if (avg >= 1 && avg < 2) {
      color = 'Red';
    }

    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐⭐ = ${dataedit.vote5.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐ = ${dataedit.vote4.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: '‎',
        value: `\`\`\`⭐⭐⭐ = ${dataedit.vote3.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐ = ${dataedit.vote2.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐ = ${dataedit.vote1.length || 0}\`\`\``,
        inline: false,
      },
    );
    embed.setColor(`${color}`);
    embed.setFooter({
      text: `Średnia: ${avg.toFixed(2)} // Łączne: ${totalpkt}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
    });

    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na ⭐⭐`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'karaokevote3') {
    const checkuser = await db.findOne({
      messid: interaction.message.id,
      vote3: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na ⭐⭐⭐!',
        ephemeral: true,
      });

    const data = await db.findOne({ messid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          vote2: interaction.member.id,
          vote1: interaction.member.id,
          vote4: interaction.member.id,
          vote5: interaction.member.id,
        },
        $push: {
          vote3: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messid: interaction.message.id });
    const msg = interaction.message;
    const vote1 = dataedit.vote1.length * 1;
    const vote2 = dataedit.vote2.length * 2;
    const vote3 = dataedit.vote3.length * 3;
    const vote4 = dataedit.vote4.length * 4;
    const vote5 = dataedit.vote5.length * 5;

    const totalvote =
      dataedit.vote1.length +
      dataedit.vote2.length +
      dataedit.vote3.length +
      dataedit.vote4.length +
      dataedit.vote5.length;
    const avg = (vote1 + vote2 + vote3 + vote4 + vote5) / totalvote;
    const totalpkt = vote1 + vote2 + vote3 + vote4 + vote5;
    await data.updateOne({ total: totalpkt });

    let color;
    if (avg >= 4.25) {
      color = 'Green';
    }
    if (avg >= 3.8 && avg < 4.25) {
      color = '#C0FF00';
    }
    if (avg >= 3 && avg < 3.8) {
      color = 'Yellow';
    }
    if (avg >= 2 && avg < 3) {
      color = 'Orange';
    }
    if (avg >= 1 && avg < 2) {
      color = 'Red';
    }

    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐⭐ = ${dataedit.vote5.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐ = ${dataedit.vote4.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: '‎',
        value: `\`\`\`⭐⭐⭐ = ${dataedit.vote3.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐ = ${dataedit.vote2.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐ = ${dataedit.vote1.length || 0}\`\`\``,
        inline: false,
      },
    );
    embed.setColor(`${color}`);
    embed.setFooter({
      text: `Średnia: ${avg.toFixed(2)} // Łączne: ${totalpkt}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
    });

    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na ⭐⭐⭐`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'karaokevote4') {
    const checkuser = await db.findOne({
      messid: interaction.message.id,
      vote4: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na ⭐⭐⭐⭐!',
        ephemeral: true,
      });

    const data = await db.findOne({ messid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          vote2: interaction.member.id,
          vote3: interaction.member.id,
          vote1: interaction.member.id,
          vote5: interaction.member.id,
        },
        $push: {
          vote4: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messid: interaction.message.id });
    const msg = interaction.message;
    const vote1 = dataedit.vote1.length * 1;
    const vote2 = dataedit.vote2.length * 2;
    const vote3 = dataedit.vote3.length * 3;
    const vote4 = dataedit.vote4.length * 4;
    const vote5 = dataedit.vote5.length * 5;

    const totalvote =
      dataedit.vote1.length +
      dataedit.vote2.length +
      dataedit.vote3.length +
      dataedit.vote4.length +
      dataedit.vote5.length;
    const avg = (vote1 + vote2 + vote3 + vote4 + vote5) / totalvote;
    const totalpkt = vote1 + vote2 + vote3 + vote4 + vote5;
    await data.updateOne({ total: totalpkt });

    let color;
    if (avg >= 4.25) {
      color = 'Green';
    }
    if (avg >= 3.8 && avg < 4.25) {
      color = '#C0FF00';
    }
    if (avg >= 3 && avg < 3.8) {
      color = 'Yellow';
    }
    if (avg >= 2 && avg < 3) {
      color = 'Orange';
    }
    if (avg >= 1 && avg < 2) {
      color = 'Red';
    }

    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐⭐ = ${dataedit.vote5.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐ = ${dataedit.vote4.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: '‎',
        value: `\`\`\`⭐⭐⭐ = ${dataedit.vote3.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐ = ${dataedit.vote2.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐ = ${dataedit.vote1.length || 0}\`\`\``,
        inline: false,
      },
    );
    embed.setColor(`${color}`);
    embed.setFooter({
      text: `Średnia: ${avg.toFixed(2)} // Łączne: ${totalpkt}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
    });

    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na ⭐⭐⭐⭐`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'karaokevote5') {
    const checkuser = await db.findOne({
      messid: interaction.message.id,
      vote5: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na ⭐⭐⭐⭐⭐!',
        ephemeral: true,
      });

    const data = await db.findOne({ messid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          vote2: interaction.member.id,
          vote3: interaction.member.id,
          vote4: interaction.member.id,
          vote1: interaction.member.id,
        },
        $push: {
          vote5: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messid: interaction.message.id });
    const msg = interaction.message;
    const vote1 = dataedit.vote1.length * 1;
    const vote2 = dataedit.vote2.length * 2;
    const vote3 = dataedit.vote3.length * 3;
    const vote4 = dataedit.vote4.length * 4;
    const vote5 = dataedit.vote5.length * 5;

    const totalvote =
      dataedit.vote1.length +
      dataedit.vote2.length +
      dataedit.vote3.length +
      dataedit.vote4.length +
      dataedit.vote5.length;
    const avg = (vote1 + vote2 + vote3 + vote4 + vote5) / totalvote;
    const totalpkt = vote1 + vote2 + vote3 + vote4 + vote5;
    await data.updateOne({ total: totalpkt });

    let color;
    if (avg >= 4.25) {
      color = 'Green';
    }
    if (avg >= 3.8 && avg < 4.25) {
      color = '#C0FF00';
    }
    if (avg >= 3 && avg < 3.8) {
      color = 'Yellow';
    }
    if (avg >= 2 && avg < 3) {
      color = 'Orange';
    }
    if (avg >= 1 && avg < 2) {
      color = 'Red';
    }

    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐⭐ = ${dataedit.vote5.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐⭐⭐ = ${dataedit.vote4.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: '‎',
        value: `\`\`\`⭐⭐⭐ = ${dataedit.vote3.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐⭐ = ${dataedit.vote2.length || 0}\`\`\``,
        inline: false,
      },
      {
        name: `‎`,
        value: `\`\`\`⭐ = ${dataedit.vote1.length || 0}\`\`\``,
        inline: false,
      },
    );
    embed.setColor(`${color}`);
    embed.setFooter({
      text: `Średnia: ${avg.toFixed(2)} // Łączne: ${totalpkt}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1012757650225770526.png?size=4096&quality=lossless',
    });

    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na ⭐⭐⭐⭐⭐`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'karaokevoteclose') {
    interaction.deferUpdate();
    const ROLE = '871190767098540032';
    const hasRole = interaction.member.roles.cache.has(ROLE);
    if (!hasRole) {
      return interaction.reply({
        content: `Tylko administracja może otworzyć/zamknąć głosowanie!`,
        ephemeral: true,
      });
    }

    const admin = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('karaokevoteopen').setStyle('Danger').setEmoji(`🔓`),
    );
    interaction.message.edit({ components: [admin] });
  }

  if (interaction.customId === 'karaokevoteopen') {
    interaction.deferUpdate();
    const ROLE = '871190767098540032';
    const hasRole = interaction.member.roles.cache.has(ROLE);
    if (!hasRole) {
      return interaction.reply({
        content: `Tylko administracja może otworzyć/zamknąć głosowanie!`,
        ephemeral: true,
      });
    }

    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('karaokevote1').setStyle('Secondary').setEmoji(`${emoji.JEDEN}`).setLabel('⭐'),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('karaokevote2').setStyle('Secondary').setEmoji(`${emoji.DWA}`).setLabel('⭐'),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('karaokevote3').setStyle('Secondary').setEmoji(`${emoji.TRZY}`).setLabel('⭐'),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('karaokevote4')
          .setStyle('Secondary')
          .setEmoji(`${emoji.CZTERY}`)
          .setLabel('⭐'),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('karaokevote5').setStyle('Secondary').setEmoji(`${emoji.PIEC}`).setLabel('⭐'),
      );
    const admin = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('karaokevoteclose').setStyle('Success').setEmoji(`🔒`),
    );

    return interaction.message.edit({ components: [button, admin] });
  }
  return 0;
});
