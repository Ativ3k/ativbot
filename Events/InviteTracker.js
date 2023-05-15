// test
const { EmbedBuilder } = require('discord.js');

const newold = '793143032437669898';
const InvitesTracker = require('@androz2091/discord-invites-tracker');
const database = require('../Models/InviteTracker');

const client = require('../index');
const emoji = require('../json/emoji.json');

const tracker = InvitesTracker.init(client, {
  fetchGuilds: true,
  fetchVanity: true,
  fetchAuditLogs: true,
});

tracker.on('guildMemberAdd', async (member, type, invite) => {
  const totalCount = member.guild.memberCount;
  const channel = member.guild.channels.cache.get(newold);
  if (channel === undefined) return;

  if (type === 'normal') {
    const data = await database.findOne({
      GuildID: member.guild.id,
      MemberID: invite.inviter.id,
    });
    const antyduplicate = await database.findOne({
      GuildID: member.guild.id,
      Total: [member.id],
    });
    if (antyduplicate) {
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setAuthor({
          name: `${member.user.tag} (${member.user.id})`,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(
          `${emoji.JOIN} Dołączył ${member}! jest \`${totalCount}\` członkiem serwera!\n` +
            `${emoji.JOIN} Dołączył z zaproszenia <@${invite.inviter.id}>, ilość: ${antyduplicate.Total.length}`,
        );

      if (channel === undefined) return;
      channel.send({ embeds: [embed] });
    }
    if (!antyduplicate) {
      if (!data) {
        await new database({
          GuildID: member.guild.id,
          MemberID: invite.inviter.id,
          Total: member.id,
        }).save();
        const updated = await database.findOne({
          GuildID: member.guild.id,
          MemberID: invite.inviter.id,
          Total: [member.id],
        });

        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setAuthor({
            name: `${member.user.tag} (${member.user.id})`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            `${emoji.JOIN} Dołączył ${member}! jest \`${totalCount}\` członkiem serwera!\n` +
              `${emoji.JOIN} Dołączył z zaproszenia: **${invite.code}** (<@${invite.inviter.id}>), ilość: ${updated.Total.length}`,
          );
        if (channel === undefined) return;
        channel.send({ embeds: [embed] });
      }
      if (data) {
        await data.updateOne({ $push: { Total: member.id } });
        const updated = await database.findOne({
          GuildID: member.guild.id,
          MemberID: invite.inviter.id,
        });
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setAuthor({
            name: `${member.user.tag} (${member.user.id})`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            `${emoji.JOIN} Dołączył ${member}! jest \`${totalCount}\` członkiem serwera!\n` +
              `${emoji.JOIN} Dołączył z zaproszenia <@${invite.inviter.id}>, ilość: ${updated.Total.length}`,
          );
        channel.send({ embeds: [embed] });
      }
    }
  } else if (type === 'vanity') {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({
        name: `${member.user.tag} (${member.user.id})`,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(`${emoji.JOIN} Dołączył ${member}! jest \`${totalCount}\` członkiem serwera!\n`);
    channel.send({ embeds: [embed] });
  } else if (type === 'permissions') {
    // welcomeChannel.send(
    //   `Welcome ${member}! I can't figure out how you joined because I don't have the "Manage Server" permission!`,
    // );
  } else if (type === 'unknown') {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({
        name: `${member.user.tag} (${member.user.id})`,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(`${emoji.JOIN} Dołączył ${member}! jest \`${totalCount}\` członkiem serwera!\n`);
    channel.send({ embeds: [embed] });
  }
});
client.on('guildMemberRemove', async (member) => {
  const totalCount = member.guild.memberCount;
  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setAuthor({
      name: `${member.user.tag} (${member.user.id})`,
      iconURL: member.displayAvatarURL(),
    })
    .setDescription(`${emoji.LEAVE} Użytkownik ${member} opuścił nas! Liczba członków: \`${totalCount}\`.`);

  const channel = member.guild.channels.cache.get(newold);
  if (channel === undefined) return;
  channel.send({ embeds: [embed] });
});
