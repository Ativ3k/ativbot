const client = require("../../index");
const emoji = require('../../json/emoji')
const roles = require('../../json/roles')
const db = require('../../Models/Eco')
const guild_settings = require('../../Models/GuildSettings')
const chalk = require('chalk');
const moment = require("moment")

const { Discord, EmbedBuilder } = require('discord.js');

client.on('voiceStateUpdate', async (oldState, newState) => {
    const guildID = oldState.guild.id || newState.guild.id
    const memberID = oldState.member.id || newState.member.id
    const data = await db.findOne({ Guildid: guildID, Memberid: memberID });
    const ecolog = await client.channels.cache.get("970062741861707806");
    const ecodebug = await client.channels.cache.get("1024446278228254762");
    const datasettings = await guild_settings.findOne({ Guildid: guildID });
    const amountMoney = datasettings.ecoVCmoney
    const amountXP = datasettings.ecoVCxp
    const settings = await guild_settings.findOne({ Guildid: guildID });
    var hour = ('0' + moment().utcOffset(2).hours()).slice(-2)
    var minutes = ('0' + moment().minutes()).slice(-2)
    var seconds = ('0' + moment().seconds()).slice(-2)
    var year = moment().get('year');
    var month = ('0' + (moment().get('month') + 1)).slice(-2)
    var day = ('0' + moment().get('date')).slice(-2)

    if (settings.ecoVC == 1) {
        const stateJoinBot = newState.member.user.bot
        if (stateJoinBot) return

        if (!data && !newState.mute) {
            databaseVC = await db.create({ Guildid: guildID, Memberid: memberID, Membertag: newState.member.user.username, Logs: [], Money: 1, Lastmessagetime: Date.now(), Messagescount: 0, GoodMemeCount: 0, Lastvoicestatus: Date.now(), Voicecount: 0, XPupvote: 0, Upvotegettime: 0, Upvotecooldown: 0})
            databaseVC.save()
            const update = await db.findOne({ Guildid: guildID, Memberid: memberID })
            const embed = new EmbedBuilder().setColor('Green').setDescription(`**Zarejestrowano nową osobe:** <@${newState.member.id}> **=>** ${update.Money.toFixed(2)}${emoji.jascoin}`)
            await ecolog.send({ embeds: [embed] })
        }
        if (data) {

            if (oldState.channel && oldState.channel != oldState.guild.afkChannel && newState.channel && !newState.mute && newState.channel.members.filter((member) => !member.user.bot).size <= 1) {
                const newdata = await db.findOne({ Guildid: guildID, Memberid: memberID });
                const sum = Date.now() - newdata.Lastvoicestatus - Math.round(client.ws.ping)
                const sumadd = sum / 1000 / 60
                const vcadd = sumadd / 60
                addvalue = await db.findOne({ Memberid: oldState.member.id })
                const log = `${day}/${month}/${year} - ${hour}:${minutes}:${seconds} **|** Otrzymałeś **${sumadd.toFixed(2)}**${emoji.jascoin} za **\`VoiceChannel\`**`
                const channelsize = newState.channel.members.filter((member) => !member.user.bot).size
                if (sum > 5000 && newState.channel != oldState.channel && oldState.channel != null) {
                    await addvalue.updateOne({
                        Lastvoicestatus: Date.now(),
                        $inc: { Money: sumadd, Voicecount: vcadd }, $push: { Logs: log }
                    })
                    return console.log(chalk.yellow(`(!) `) + chalk.green(`${oldState.member.user.username} Aktualizacja przed małym kanałem => +${sumadd.toFixed(2)}`))
                }

                if (channelsize <= 1) return console.log(chalk.yellow(`(!) `) + chalk.red(`${oldState.member.user.username} Zbyt mały kanał => ${channelsize} (${sumadd.toFixed(2)})`))
                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.red(`Zbyt mały kanał, zatrzymuje i dodaje ` + chalk.blue(` | ${oldState.member.user.username}`) + chalk.green(` | ${sumadd.toFixed(2)}`))) }

                await newdata.updateOne({ Lastvoicestatus: Date.now() })
                await addvalue.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, $push: { Logs: log } })

                const updatedata = await db.findOne({ Memberid: oldState.member.id })
                const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${oldState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                await ecolog.send({ embeds: [embed] })

                if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }
            }

            if (!oldState.channel && newState.channel) {
                const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                if (stateMembers.size <= 1) return

                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.green(`Nowy kanał, zaczynam liczyć od nowa`) + chalk.blue(` | ${oldState.member.user.username}`)) }
                update = await db.findOne({ Guildid: guildID, Memberid: memberID });
                await update.updateOne({ Lastvoicestatus: Date.now() })
            }

            if (oldState.channel === oldState.guild.afkChannel && newState.channel) {
                const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                if (stateMembers.size <= 1) return

                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.green(`Nowy kanał, zaczynam liczyć od nowa`) + chalk.blue(` | ${oldState.member.user.username}`)) }
                update = await db.findOne({ Guildid: guildID, Memberid: memberID });
                await update.updateOne({ Lastvoicestatus: Date.now() })
            }

            if (oldState.channel != oldState.guild.afkChannel && !newState.channel && !oldState.mute || newState.channel === newState.guild.afkChannel) {
                if (oldState.channel === oldState.guild.afkChannel) return
                const newdata = await db.findOne({ Guildid: oldState.guild.id, Memberid: oldState.member.id });
                const sum = Date.now() - newdata.Lastvoicestatus - Math.round(client.ws.ping)
                const sumadd = sum / 1000 / 60
                const stateMembers = oldState.channel.members.filter((member) => !member.user.bot);
                if (stateMembers.size <= 1) return
                if (sum < 5000 && settings.Debug == 1) return console.log(chalk.yellow(`(!) `) + chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`))
                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.red(`Opuścił kanał, zatrzymuje i dodaje ` + chalk.blue(` | ${oldState.member.user.username}`) + chalk.green(` | ${sumadd.toFixed(2)}`))) }

                await newdata.updateOne({ Lastvoicestatus: Date.now() })

                const log = `${day}/${month}/${year} - ${hour}:${minutes}:${seconds} **|** Otrzymałeś **${sumadd.toFixed(2)}**${emoji.jascoin} za **\`VoiceChannel\`**`

                const vcadd = sumadd / 60
                addvalue = await db.findOne({ Memberid: oldState.member.id })

                await addvalue.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, $push: { Logs: log } })

                const updatedata = await db.findOne({ Memberid: oldState.member.id })
                const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${oldState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                await ecolog.send({ embeds: [embed] })

                if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }

            }
            if (oldState.channel != oldState.guild.afkChannel && !oldState.mute && newState.channel === newState.guild.afkChannel) {
                const newdata = await db.findOne({ Guildid: oldState.guild.id, Memberid: oldState.member.id });
                const sum = Date.now() - newdata.Lastvoicestatus - Math.round(client.ws.ping)
                const sumadd = sum / 1000 / 60
                const stateMembers = oldState.channel.members.filter((member) => !member.user.bot);
                if (stateMembers.size <= 1) return
                if (sum < 5000 && settings.Debug == 1) return console.log(chalk.yellow(`(!) `) + chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`))
                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.red(`Kanał AFK, zatrzymuje i dodaje ` + chalk.blue(` | ${oldState.member.user.username}`) + chalk.green(` | ${sumadd.toFixed(2)}`))) }

                await newdata.updateOne({ Lastvoicestatus: Date.now() })

                const log = `${day}/${month}/${year} - ${hour}:${minutes}:${seconds} **|** Otrzymałeś **${sumadd.toFixed(2)}**${emoji.jascoin} za **\`VoiceChannel\`**`

                const vcadd = sumadd / 60
                addvalue = await db.findOne({ Memberid: oldState.member.id })

                await addvalue.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, $push: { Logs: log } })

                const updatedata = await db.findOne({ Memberid: oldState.member.id })
                const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${oldState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                await ecolog.send({ embeds: [embed] })

                if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }

            }

            if (oldState.channel != oldState.guild.afkChannel && newState.channel != newState.guild.afkChannel && oldState.channel === newState.channel && oldState.mute && !newState.mute) {
                const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                if (stateMembers.size <= 1) return
                if (newState.channel === newState.guild.afkChannel) return

                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.green(`Unmute, zaczynam liczyć od nowa`) + chalk.blue(` | ${oldState.member.user.username}`)) }

                const update = await db.findOne({ Guildid: guildID, Memberid: memberID });
                await update.updateOne({ Lastvoicestatus: Date.now() })
            }

            if (oldState.channel != oldState.guild.afkChannel && newState.channel != newState.guild.afkChannel && oldState.channel === newState.channel && !oldState.mute && newState.mute) {
                const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                if (stateMembers.size <= 1) return
                if (newState.channel === newState.guild.afkChannel) return


                const newdata = await db.findOne({ Guildid: guildID, Memberid: memberID });
                const sum = Date.now() - newdata.Lastvoicestatus - Math.round(client.ws.ping)
                const sumadd = sum / 1000 / 60
                if (sum < 5000 && settings.Debug == 1) return console.log(chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`))
                if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.red(`Mute, zatrzymuje i dodaje ` + chalk.blue(` | ${oldState.member.user.username} `) + chalk.green(` | +${sumadd.toFixed(2)} `))) }

                const log = `${day}/${month}/${year} - ${hour}:${minutes}:${seconds} **|** Otrzymałeś **${sumadd.toFixed(2)}**${emoji.jascoin} za **\`VoiceChannel\`**`

                const vcadd = sumadd / 60
                const addvalue = await db.findOne({ Guildid: guildID, Memberid: newState.member.id })
                await addvalue.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, $push: { Logs: log } })

                const updatedata = await db.findOne({ Memberid: newState.member.id })
                const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${newState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                await ecolog.send({ embeds: [embed] })

                if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }

            }
            if (oldState.channel) {
                if (oldState.channel.members.filter((member) => !member.user.bot && member.user.id).size === 1) {
                    const seconduser = oldState.channel.members.filter((member) => !member.user.bot && member.user.id != oldState.member.id)
                    if (seconduser) return
                    const updateuser = seconduser.at(0).user
                    if (!updateuser) return
                    const newdata = await db.findOne({ Guildid: guildI-D, Memberid: updateuser.id });
                    const sum = Date.now() - newdata.Lastvoicestatus - Math.round(client.ws.ping)
                    const sumadd = sum / 1000 / 60
                    const vcadd = sumadd / 60
                    const log = `${day}/${month}/${year} - ${hour}:${minutes}:${seconds} **|** Otrzymałeś **${sumadd.toFixed(2)}**${emoji.jascoin} za **\`VoiceChannel\`**`
                    const addvalue = await db.findOne({ Guildid: guildID, Memberid: updateuser.id })
                    await addvalue.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, $push: { Logs: log } })

                    const updatedata = await db.findOne({ Guildid: guildID, Memberid: updateuser.id });
                    updatedata.updateOne({ Lastvoicestatus: Date.now() })
                    if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.red(`Pomniejszony kanał, aktualizuje i liczę ` + chalk.blue(` | ${updateuser.username}`))) }
                    const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${oldState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                    await ecolog.send({ embeds: [embed] })
                    if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }
                }
            }

            if (newState.channel) {
                if (newState.channel.members.filter((member) => !member.user.bot && member.user.id).size === 2) {
                    const seconduser = newState.channel.members.filter((member) => !member.user.bot && member.user.id != newState.member.id)
                    const updateuser = seconduser.at(0).user
                    const updatedata = await db.findOne({ Guildid: guildID, Memberid: updateuser.id });
                    updatedata.updateOne({ Lastvoicestatus: Date.now() })
                    if (settings.Debug == 1) { console.log(chalk.yellow(`(!) `) + chalk.red(`Powiększony kanał, aktualizuje i liczę ` + chalk.blue(` | ${updateuser.username}`))) }
                }
            }
        }
    }
})
