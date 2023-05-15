const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
const kuponMECZ = require('../../Models/kuponMECZE');
const Eco = require('../../Models/Eco');
const MECZE = require('../../Models/MECZE');

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === 'matchlist') {
    const selected = interaction.values[0];
    const data = await kuponMECZ.findOne({
      GuildID: interaction.guild.id,
      MemberID: interaction.member.id,
      MemberTAG: interaction.member.tag,
      MessID: interaction.message.id,
    });
    if (!data) {
      await interaction.reply({
        content: `${emoji.TAK} Pomyślnie wybrano mecz!`,
        ephemeral: true,
      });
      kuponMECZ.create({
        GuildID: interaction.guild.id,
        MemberID: interaction.member.id,
        MemberTAG: interaction.user.tag,
        idmeczu: selected,
        MessID: interaction.message.id,
      });
    }
    if (data) {
      await interaction.reply({
        content: `${emoji.TAK} Pomyślnie wybrano mecz!`,
        ephemeral: true,
      });
      const livecupon = await kuponMECZ.findOne({
        GuildID: interaction.guild.id,
        MemberID: interaction.member.id,
        MessID: interaction.message.id,
      });
      await livecupon.updateOne({ idmeczu: selected });
    }
  }

  if (interaction.customId === 'betto') {
    const selected = interaction.values[0];
    const data = await kuponMECZ.findOne({
      GuildID: interaction.guild.id,
      MemberID: interaction.member.id,
      MessID: interaction.message.id,
    });
    if (!data)
      return interaction.reply({
        content: `${emoji.NIE} Najpierw wybierz mecz!`,
        ephemeral: true,
      });

    if (data) {
      interaction.reply({
        content: `${emoji.TAK} Pomyślnie wybrano drużyne!`,
        ephemeral: true,
      });

      await data.updateOne({ Winner: selected });
    }
  }

  if (interaction.customId === 'betcoins') {
    const selected = interaction.values[0];
    const data = await kuponMECZ.findOne({
      GuildID: interaction.guild.id,
      MemberID: interaction.member.id,
      MessID: interaction.message.id,
    });
    if (!data) return 0;
    if (data) {
      if (!data.Winner) return 0;
      if (data.Winner) {
        interaction.reply({
          content: `${emoji.TAK} Pomyślnie zatwierdzono stawke!`,
          ephemeral: true,
        });
        await data.updateOne({ BetValue: selected });
      }
    }
  }

  if (interaction.customId === 'acceptbet') {
    const data = await kuponMECZ.findOne({
      GuildID: interaction.guild.id,
      MemberID: interaction.member.id,
      MessID: interaction.message.id,
    });
    if (data) {
      if (!data.idmeczu || !data.Winner || !data.BetValue) {
        interaction.reply({
          content: `${emoji.NIE} Brakuje wybranych opcji!`,
          ephemeral: true,
        });
      } else {
        const ecodb = Eco.findOne({
          Guildid: interaction.guild.id,
          Memberid: interaction.member.id,
        });
        await data.updateOne({ Confirmed: true, Time: Date.now() });
        await ecodb.updateOne({ $inc: { Money: -data.BetValue } });

        const findid = await kuponMECZ.findOne({
          GuildID: interaction.guild.id,
          MemberID: interaction.member.id,
          MessID: interaction.message.id,
        });
        const { ObjectId } = require('mongodb');
        const objId = new ObjectId(findid.idmeczu);
        const druzyny = await MECZE.findOne({ _id: objId });

        let multipler;
        if (findid.Winner === 'druzyna1') {
          multipler = druzyny.ifT1win;
        }
        if (findid.Winner === 'druzyna2') {
          multipler = druzyny.ifT2win;
        }
        if (findid.Winner === 'remis') {
          multipler = druzyny.ifDRAW;
        }
        await data.updateOne({
          Druzyna1: druzyny.Druzyna1,
          Druzyna2: druzyny.Druzyna2,
          Status: `${emoji.MINUS}`,
          Multipler: multipler,
        });
        interaction.update({
          content: `${emoji.TAK} Pomyślnie zatwierdziłeś swój kupon!\nTwoja potencjalna wygrana to: ${
            data.BetValue * multipler
          }`,
          components: [],
        });
      }
    }
    if (!data) {
      interaction.reply({
        content: `${emoji.NIE} Najpierw uzupełnij opcje!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'denybet') {
    const data = await kuponMECZ.findOne({
      GuildID: interaction.guild.id,
      MemberID: interaction.member.id,
      MessID: interaction.message.id,
    });
    interaction.update({
      content: `:warning: Anulowano kupon!`,
      components: [],
    });
    if (data) {
      await data.delete();
    }
  }

  if (interaction.customId === 'matchinfo-team1') {
    const embedmessage = interaction.message.embeds[0];
    const matchid = await embedmessage.footer.text;
    const kupony = await kuponMECZ.find({
      GuildID: interaction.guild.id,
      idmeczu: matchid,
    });

    const timeoutfunction = Date.now() / 1000 - interaction.message.createdTimestamp / 1000;
    const timeout = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('matchinfo-team1')
          .setLabel(`${kupony[0].Druzyna1}`)
          .setStyle('Danger')
          .setDisabled(true),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('matchinfo-draw').setLabel(`Remis`).setStyle('Danger').setDisabled(true),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('matchinfo-team2')
          .setLabel(`${kupony[0].Druzyna2}`)
          .setStyle('Danger')
          .setDisabled(true),
      );
    if (timeoutfunction > 60) return interaction.message.edit({ components: [timeout] });
    if (interaction.user.id !== interaction.message.interaction.user.id) return interaction.deferUpdate();

    const reply = await kupony
      .filter((x) => x.idmeczu === matchid && x.Winner === 'druzyna1' && x.Confirmed === true)
      .sort((a, b) => b.BetValue - a.BetValue)
      .slice(0, 25)
      .map(
        (x, i) =>
          `${i + 1}| <@${x.MemberID}>, ${x.BetValue} ${emoji.jascoin} , ${
            x.Status || `${emoji.MINUS}`
          }, ${x.Winner.replace('druzyna1', `${x.Druzyna1}`)
            .replace('druzyna2', `${x.Druzyna2}`)
            .replace('remis', `Remis`)}`,
      )
      .join('\n');

    const updatedembed = EmbedBuilder.from(embedmessage).setDescription(
      `${reply || `**Brak kuponów. (${kupony[0].Druzyna1})**`}`,
    );
    interaction.deferUpdate();
    await interaction.message.edit({ embeds: [updatedembed] });
  }
  if (interaction.customId === 'matchinfo-draw') {
    const embedmessage = interaction.message.embeds[0];
    const matchid = await embedmessage.footer.text;
    const kupony = await kuponMECZ.find({
      GuildID: interaction.guild.id,
      idmeczu: matchid,
    });
    const timeoutfunction = Date.now() / 1000 - interaction.message.createdTimestamp / 1000;
    const timeout = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('matchinfo-team1')
          .setLabel(`${kupony[0].Druzyna1}`)
          .setStyle('Danger')
          .setDisabled(true),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('matchinfo-draw').setLabel(`Remis`).setStyle('Danger').setDisabled(true),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('matchinfo-team2')
          .setLabel(`${kupony[0].Druzyna2}`)
          .setStyle('Danger')
          .setDisabled(true),
      );
    if (timeoutfunction > 60) return interaction.message.edit({ components: [timeout] });
    if (interaction.user.id !== interaction.message.interaction.user.id) return interaction.deferUpdate();

    const reply = await kupony
      .filter((x) => x.idmeczu === matchid && x.Winner === 'remis' && x.Confirmed === true)
      .sort((a, b) => b.BetValue - a.BetValue)
      .slice(0, 25)
      .map(
        (x, i) =>
          `${i + 1}| <@${x.MemberID}>, ${x.BetValue} ${emoji.jascoin} , ${
            x.Status || `${emoji.MINUS}`
          }, ${x.Winner.replace('druzyna1', `${x.Druzyna1}`)
            .replace('druzyna2', `${x.Druzyna2}`)
            .replace('remis', `Remis`)}`,
      )
      .join('\n');

    const updatedembed = EmbedBuilder.from(embedmessage).setDescription(`${reply || `**Brak kuponów. (Remis)**`}`);
    interaction.deferUpdate();
    await interaction.message.edit({ embeds: [updatedembed] });
  }
  if (interaction.customId === 'matchinfo-team2') {
    const embedmessage = interaction.message.embeds[0];
    const matchid = await embedmessage.footer.text;
    const kupony = await kuponMECZ.find({
      GuildID: interaction.guild.id,
      idmeczu: matchid,
    });
    const timeoutfunction = Date.now() / 1000 - interaction.message.createdTimestamp / 1000;
    const timeout = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('matchinfo-team1')
          .setLabel(`${kupony[0].Druzyna1}`)
          .setStyle('Danger')
          .setDisabled(true),
      )
      .addComponents(
        new ButtonBuilder().setCustomId('matchinfo-draw').setLabel(`Remis`).setStyle('Danger').setDisabled(true),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('matchinfo-team2')
          .setLabel(`${kupony[0].Druzyna2}`)
          .setStyle('Danger')
          .setDisabled(true),
      );
    if (timeoutfunction > 60) return interaction.message.edit({ components: [timeout] });
    if (interaction.user.id !== interaction.message.interaction.user.id) return interaction.deferUpdate();

    const reply = await kupony
      .filter((x) => x.idmeczu === matchid && x.Winner === 'druzyna2' && x.Confirmed === true)
      .sort((a, b) => b.BetValue - a.BetValue)
      .slice(0, 25)
      .map(
        (x, i) =>
          `${i + 1}| <@${x.MemberID}>, ${x.BetValue} ${emoji.jascoin} , ${
            x.Status || `${emoji.MINUS}`
          }, ${x.Winner.replace('druzyna1', `${x.Druzyna1}`)
            .replace('druzyna2', `${x.Druzyna2}`)
            .replace('remis', `Remis`)}`,
      )
      .join('\n');
    const updatedembed = EmbedBuilder.from(embedmessage).setDescription(
      `${reply || `**Brak kuponów. (${kupony[0].Druzyna2})**`}`,
    );
    interaction.deferUpdate();
    await interaction.message.edit({ embeds: [updatedembed] });
  }
  return 0;
});
