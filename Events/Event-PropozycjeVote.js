const { EmbedBuilder } = require('discord.js');
const client = require('../index'); 
const emoji = require('../json/emoji.json');
const db = require('../Models/propozycjedb');

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === 'propozycjeyes') {
    const checkuser = await db.findOne({
      messageid: interaction.message.id,
      voteyes: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na **TAK**!',
        ephemeral: true,
      });

    const data = await db.findOne({ messageid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          voteminus: interaction.member.id,
          voteno: interaction.member.id,
        },
        $push: {
          voteyes: interaction.member.id,
        },
      });
    }

    const dataedit = await db.findOne({ messageid: interaction.message.id });
    const msg = interaction.message;
    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `${emoji.TAK}\n **${dataedit.voteyes.length}**`,
        inline: true,
      },
      {
        name: `‎`,
        value: `${emoji.MINUS}\n **${dataedit.voteminus.length || 0}**`,
        inline: true,
      },
      {
        name: '‎',
        value: `${emoji.NIE}\n **${dataedit.voteno.length || 0}**`,
        inline: true,
      },
    );
    msg.edit({ embeds: [embed] });

    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na **TAK**`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'propozycjeidk') {
    const checkuser = await db.findOne({
      messageid: interaction.message.id,
      voteminus: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na **Nie wiem**!',
        ephemeral: true,
      });

    const data = await db.findOne({ messageid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          voteyes: interaction.member.id,
          voteno: interaction.member.id,
        },
        $push: {
          voteminus: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messageid: interaction.message.id });
    const msg = interaction.message;
    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `${emoji.TAK}\n **${dataedit.voteyes.length}**`,
        inline: true,
      },
      {
        name: `‎`,
        value: `${emoji.MINUS}\n **${dataedit.voteminus.length || 0}**`,
        inline: true,
      },
      {
        name: '‎',
        value: `${emoji.NIE}\n **${dataedit.voteno.length || 0}**`,
        inline: true,
      },
    );
    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na **Nie wiem**`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'propozycjeno') {
    const checkuser = await db.findOne({
      messageid: interaction.message.id,
      voteno: interaction.member.id,
    });
    if (checkuser)
      return interaction.reply({
        content: 'Już oddałeś/aś głos na **NIE**!',
        ephemeral: true,
      });

    const data = await db.findOne({ messageid: interaction.message.id });
    if (data) {
      await data.updateOne({
        $pull: {
          voteminus: interaction.member.id,
          voteyes: interaction.member.id,
        },
        $push: {
          voteno: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messageid: interaction.message.id });
    const msg = interaction.message;
    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `${emoji.TAK}\n **${dataedit.voteyes.length}**`,
        inline: true,
      },
      {
        name: `‎`,
        value: `${emoji.MINUS}\n **${dataedit.voteminus.length || 0}**`,
        inline: true,
      },
      {
        name: '‎',
        value: `${emoji.NIE}\n **${dataedit.voteno.length || 0}**`,
        inline: true,
      },
    );
    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie oddano głos na **NIE**`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'propozycjedelete') {
    const data = await db.findOne({ messageid: interaction.message.id });
    const yes = await db.findOne({
      messageid: interaction.message.id,
      voteyes: interaction.member.id,
    });
    const minus = await db.findOne({
      messageid: interaction.message.id,
      voteminus: interaction.member.id,
    });
    const no = await db.findOne({
      messageid: interaction.message.id,
      voteno: interaction.member.id,
    });
    if (!yes && !minus && !no)
      return interaction.reply({
        content: 'W tym głosowaniu nie ma Twojego głosu!',
        ephemeral: true,
      });

    if (data) {
      await data.updateOne({
        $pull: {
          voteminus: interaction.member.id,
          voteno: interaction.member.id,
          voteyes: interaction.member.id,
        },
      });
    }
    const dataedit = await db.findOne({ messageid: interaction.message.id });
    const msg = interaction.message;
    const embed = EmbedBuilder.from(msg.embeds[0]);
    embed.setFields(
      {
        name: `‎`,
        value: `${emoji.TAK}\n **${dataedit.voteyes.length}**`,
        inline: true,
      },
      {
        name: `‎`,
        value: `${emoji.MINUS}\n **${dataedit.voteminus.length || 0}**`,
        inline: true,
      },
      {
        name: '‎',
        value: `${emoji.NIE}\n **${dataedit.voteno.length || 0}**`,
        inline: true,
      },
    );
    msg.edit({ embeds: [embed] });
    const reply = new EmbedBuilder()
      .setDescription(`${emoji.SUCCESS} Pomyslnie usunięto Twój głos!`)
      .setColor('Random');
    interaction.reply({ embeds: [reply], ephemeral: true });
  }

  if (interaction.customId === 'propozycjeinfo') {
    const yes = await db.findOne({
      messageid: interaction.message.id,
      voteyes: interaction.member.id,
    });
    const minus = await db.findOne({
      messageid: interaction.message.id,
      voteminus: interaction.member.id,
    });
    const no = await db.findOne({
      messageid: interaction.message.id,
      voteno: interaction.member.id,
    });

    let status;
    if (yes) {
      status = `${emoji.TAK} Tak`;
    }
    if (minus) {
      status = `${emoji.MINUS} Nie wiem`;
    }
    if (no) {
      status = `${emoji.NIE} Nie`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Informacje o głosowaniu`)
      .setDescription(
        `Hej! 👋\nTwój głos: **${status || 'Brak'}**\n\n${emoji.TAK} - głos na **\`Tak\`**\n${
          emoji.MINUS
        } - głos na **\`Nie wiem\`**\n${emoji.NIE} - głos na **\`Nie\`**\n${
          emoji.TRASH
        } - usunięcie Twojego głosu\n❓ - informacja którą czytasz`,
      )
      .setColor('Random');
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
  return 0;
});
