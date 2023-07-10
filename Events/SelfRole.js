const { EmbedBuilder } = require('discord.js');
const client = require('../index');
const emoji = require('../json/emoji.json');

client.on('interactionCreate', async (interaction) => {
  const memberRoles = interaction.member.roles;
  const logs = client.channels.cache.get('969995573983838218');
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'wojewodztwa') {
      const roleid = [
        '871894217289531462',
        '871894812134109204',
        '871894942983802911',
        '872173978880446564',
        '871895110139387914',
        '871896354455183400',
        '871896422390317066',
        '871896460311023616',
        '871896483975290920',
        '871896507421442048',
        '871896531551264838',
        '871896553223237652',
        '871896572324102154',
        '871896603852693575',
        '872175391643684925',
        '871896668398813259',
        '871917216034062357',
      ];
      const roleId = interaction.values[0];
      const role = interaction.guild.roles.cache.get(roleId);
      await interaction.deferReply({ ephemeral: true });
      memberRoles.remove(roleid);
      memberRoles.add(roleId || '871917216034062357');
      interaction.editReply(`**Od teraz Twoje województwo to:** <@&${role.id}>`);

      const logi = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.member.user.username}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setDescription(`<@${interaction.member.user.id}> **ustawia swoje województwo na:** <@&${role.id}>`)
        .setColor('Red');
      logs.send({ embeds: [logi] });
    }
    if (interaction.customId === 'gry') {
      const roleid = [
        '970797823987699773',
        '736455324206104640',
        '736455337904832612',
        '736455359014764674',
        '736455355768242237',
        '736455320796266550',
        '736455334838796289',
        '736455331672227910',
        '872091864994566184',
        '872092402146504734',
        '736455328149012500',
        '736455343646703707',
        '872092714202697758',
        '872092763112505394',
        '736455365415272560',
        '872092550343835688',
        '736455362122874941',
        '872092817198043216',
      ];
      const rola = interaction.values[0];
      const hasRole = interaction.member.roles.cache.has(rola);
      const gameroles = roleid.filter((v) => interaction.member.roles.cache.get(v));
      const ListRole = roleid
        .filter((v) => interaction.member.roles.cache.get(v))
        .sort((a, b) => b.position - a.position)
        .map((role) => `<@&${role.toString()}>`)
        .join('\n');

      if (interaction.values[0] < 1) {
        memberRoles.remove(roleid);
        const embed = new EmbedBuilder()
          .setDescription(`${emoji.TRASH} **\`Pomyślnie wyczyszczono role!\`**`)
          .setColor('Red');
        interaction.reply({ embeds: [embed], ephemeral: true });
      }
      if (gameroles.length < 8 && interaction.values[0] > 1) {
        if (!hasRole) {
          memberRoles.add(rola);
          const embed = new EmbedBuilder()
            .setDescription(`${emoji.SUCCESS} **\`Wybrane role:\`** <@&${rola}>`)
            .setColor('Green');
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (hasRole) {
          memberRoles.remove(rola);
          const embed = new EmbedBuilder().setDescription(`**\`Usunięto role:\`** <@&${rola}>`).setColor('Red');
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
      if (gameroles.length >= 8 && interaction.values[0] > 1) {
        if (!hasRole) {
          const embed = new EmbedBuilder()
            .setDescription(
              `${emoji.FAILURE} **Masz zbyt dużą ilość ról!**\n` +
                `${emoji.NOTE} **Maksymalna ilość ról:** **\`8\`**\n` +
                `${emoji.INFO} **Ilość ról:** **\`${gameroles.length}\`**\n` +
                `**Twoje role:**\n${ListRole}`,
            )
            .setColor('Orange');
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (hasRole) {
          memberRoles.remove(rola);
          const embed = new EmbedBuilder().setDescription(`**\`Usunięto role:\`** <@&${rola}>`).setColor('Red');
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    }
  }
  if (interaction.customId === 'platforma') {
    const rola = interaction.values[0];
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else if (hasRole) {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  /// /////////////////////////////////////////////////////////////////////// PLEC
  if (interaction.customId === 'kobieta') {
    const roleid = ['872148534315606027', '872148505320357908', '871906536748879873'];
    const roleId = '872148534315606027';
    const role = interaction.guild.roles.cache.get(roleId);
    await interaction.deferReply({ ephemeral: true });
    memberRoles.remove(roleid);
    memberRoles.add(roleId);
    interaction.editReply(`**Od teraz Twoja płeć to:** <@&${role.id}>`);

    const logi = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.member.user.username}`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setDescription(`<@${interaction.member.user.id}> **ustawia swoją płeć na:** <@&${role.id}>`)
      .setColor('FF0000');
    logs.send({ embeds: [logi] });
  }
  if (interaction.customId === 'mezczyzna') {
    const roleid = ['872148534315606027', '872148505320357908', '871906536748879873'];
    const roleId = '872148505320357908';
    const role = interaction.guild.roles.cache.get(roleId);
    await interaction.deferReply({ ephemeral: true });
    memberRoles.remove(roleid);
    memberRoles.add(roleId);
    interaction.editReply(`**Od teraz Twoja płeć to:** <@&${role.id}>`);

    const logi = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.member.user.username}`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setDescription(`<@${interaction.member.user.id}> **ustawia swoją płeć na:** <@&${role.id}>`)
      .setColor('FF0000');
    logs.send({ embeds: [logi] });
  }
  if (interaction.customId === 'nieznanaplec') {
    const roleid = ['872148534315606027', '872148505320357908', '871906536748879873'];
    const roleId = '871906536748879873';
    const role = interaction.guild.roles.cache.get(roleId);
    await interaction.deferReply({ ephemeral: true });
    memberRoles.remove(roleid);
    memberRoles.add(roleId);
    interaction.editReply(`**Od teraz Twoja płeć to:** <@&${role.id}>`);

    const logi = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.member.user.username}`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setDescription(`<@${interaction.member.user.id}> **ustawia swoją płeć na:** <@&${role.id}>`)
      .setColor('FF0000');
    logs.send({ embeds: [logi] });
  }
  /// /////////////////////////////////////////////////////////////////////// FILMY
  if (interaction.customId === 'horror') {
    const rola = '872140180365144105';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'komedia') {
    const rola = '872140303887380520';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'thriller') {
    const rola = '872140332714835968';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'akcja') {
    const rola = '872140350846820354';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  /// /////////////////////////////////////////////////////////////////////// SPORT
  if (interaction.customId === 'pilkanozna') {
    const rola = '872126954776707122';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'siatkowka') {
    const rola = '872127173220257802';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'koszykowka') {
    const rola = '872127126634131576';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'tenis') {
    const rola = '872127212692836362';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'mecz') {
    const rola = '872128387173457920';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  /// /////////////////////////////////////////////////////////////////////// NEWS
  if (interaction.customId === 'odcinek') {
    const rola = '736448603194785884';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'stream') {
    const rola = '736448602083426376';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'film') {
    const rola = '736448596752203866';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === 'ping') {
    const rola = '736448578800582786';
    const hasRole = interaction.member.roles.cache.has(rola);
    if (!hasRole) {
      memberRoles.add(rola);
      interaction.reply({
        content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
        ephemeral: true,
      });
    } else {
      memberRoles.remove(rola);
      interaction.reply({
        content: `${emoji.NIE} **Usunięto role:** <@&${rola}>`,
        ephemeral: true,
      });
    }
  }
  /// /////////////////////////////////////////////////////////////////////// WIEK
  const osiemna = '686205735868432390';
  const hasOsiemna = interaction.member.roles.cache.has(osiemna);
  if (interaction.customId === '13') {
    if (hasOsiemna) {
      return interaction.reply({
        content: `${emoji.VERIFY} **Jesteś <@&${osiemna}>!**\n:arrow_right: **Sprawdź kanał** <#796367204660412478>`,
        ephemeral: true,
      });
    }
    const roleid = ['870797338124361739', '871917132118638592'];
    const rola = '870796969424072737';
    memberRoles.remove(roleid);
    memberRoles.add(rola);
    interaction.reply({
      content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
      ephemeral: true,
    });
  }
  if (interaction.customId === '16') {
    if (hasOsiemna) {
      return interaction.reply({
        content: `${emoji.VERIFY} **Jesteś <@&${osiemna}>!**\n:arrow_right: **Sprawdź kanał** <#796367204660412478>`,
        ephemeral: true,
      });
    }
    const roleid = ['870796969424072737', '871917132118638592'];
    const rola = '870797338124361739';
    memberRoles.remove(roleid);
    memberRoles.add(rola);
    interaction.reply({
      content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
      ephemeral: true,
    });
  }
  if (interaction.customId === '18') {
    if (!hasOsiemna) {
      interaction.reply({
        content: '**`Zerknij na kanał`** <#872072431295164416>.',
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: `${emoji.VERIFY} **Jesteś <@&${osiemna}>!**\n:arrow_right: **Sprawdź kanał** <#796367204660412478>`,
        ephemeral: true,
      });
    }
  }
  if (interaction.customId === '?') {
    if (hasOsiemna) {
      return interaction.reply({
        content: `${emoji.VERIFY} **Jesteś <@&${osiemna}>!**\n:arrow_right: **Sprawdź kanał** <#796367204660412478>`,
        ephemeral: true,
      });
    }
    const roleid = ['870797338124361739', '870796969424072737'];
    const rola = '871917132118638592';
    memberRoles.remove(roleid);
    memberRoles.add(rola);
    interaction.reply({
      content: `${emoji.TAK} **Dodano role:** <@&${rola}>`,
      ephemeral: true,
    });
  }
  return 0;
});
