const { EmbedBuilder } = require('discord.js');
const client = require('../../index');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/EcoReaction');
const eco = require('../../Models/Eco');
const guildSettings = require('../../Models/GuildSettings');

client.on('messageReactionAdd', async (reaction) => {
  const settings = await guildSettings.findOne({
    GuildId: reaction.message.guild.id,
  });
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  if (settings.ecoMEM === 1) {
    const autor = reaction.message.author;
    const amout = Math.floor(Math.random() * 4) + 1;
    const ecolog = await client.channels.cache.get('970062741861707806');

    const checkuser = await db.findOne({
      Guildid: reaction.message.guild.id,
      Memberid: autor.id,
    });
    if (!checkuser) {
      await db
        .create({
          Guildid: reaction.message.guild.id,
          Memberid: autor.id,
          Membertag: reaction.message.member.user.username,
          Logs: [],
          Money: 4,
          Lastmessagetime: Date.now(),
          Messagescount: 0,
          GoodMemeCount: 0,
          Lastvoicestatus: Date.now(),
          Voicecount: 0,
          XPupvote: 0,
          Upvotegettime: 0,
          Upvotecooldown: 0,
        })
        .save();
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`**Zarejestrowano nową osobe:** <@${autor.id}> **=>** 1${emoji.jascoin}`);
      await ecolog.send({ embeds: [embed] });
    }

    if (reaction.message.channel.name.includes('memiki') && reaction.emoji.name === `nie`) {
      if (reaction.count >= 16) reaction.message.delete();
    }
    if (reaction.message.channel.name.includes('memiki') && reaction.emoji.name === `tak`) {
      if (reaction.count >= 11) {
        const data = await db.findOne({
          channelid: reaction.message.channel.id,
        });
        if (!data) {
          await db
            .create({
              channelid: reaction.message.channel.id,
            })
            .save();
        }

        const finaldata = await db.findOne({
          messid: reaction.message.id,
          channelid: reaction.message.channel.id,
        });
        if (finaldata) {
          return;
        }
        if (!finaldata) {
          const create = await db.findOne({ channelid: reaction.message.channel.id });
          await create.updateOne({ $push: { messid: reaction.message.id } });

          const moneyadd = await eco.findOne({
            Guildid: reaction.message.guild.id,
            Memberid: autor.id,
          });
          if (!moneyadd) {
            if (!checkuser) {
              await db
                .create({
                  Guildid: reaction.message.guild.id,
                  Memberid: autor.id,
                  Membertag: reaction.message.author.username,
                  Logs: [],
                  Money: 1,
                  Lastmessagetime: Date.now(),
                  Messagescount: 0,
                  GoodMemeCount: 0,
                  Lastvoicestatus: Date.now(),
                  Voicecount: 0,
                  XPupvote: 0,
                  Upvotegettime: 0,
                  Upvotecooldown: 0,
                })
                .save();
              const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`**Zarejestrowano nową osobe:** <@${autor.id}> **=>** 1${emoji.jascoin}`);
              await ecolog.send({ embeds: [embed] });
            }

            await moneyadd.updateOne({
              $inc: { GoodMemeCount: 1, Money: amout },
            });
            const updatedata = await eco.findOne({ memberid: autor.id });

            const embed = new EmbedBuilder()
              .setColor('Yellow')
              .setDescription(
                `**Wpływ na konto:** <@${autor.id}> **=>** ${amout.toFixed(2)}${
                  emoji.jascoin
                } **=>** ${updatedata.money.toFixed(2)}${emoji.jascoin} | Za: **\`Reakcje.Memiki\`**`,
              );
            await ecolog.send({ embeds: [embed] });
          }

          if (moneyadd) {
            await moneyadd.updateOne({ $inc: { Money: amout } });
            const updatedata = await eco.findOne({
              Guildid: reaction.message.guild.id,
              Memberid: autor.id,
            });

            const embed = new EmbedBuilder()
              .setColor('Yellow')
              .setDescription(
                `**Wpływ na konto:** <@${autor.id}> **=>** ${amout.toFixed(2)}${
                  emoji.jascoin
                } **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`Reakcje.Memiki\`**`,
              );
            await ecolog.send({ embeds: [embed] });
          }
        }
      }
    }
  }
});
