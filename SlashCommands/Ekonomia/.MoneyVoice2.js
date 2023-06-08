const client = require("../../index");
const emoji = require('../../json/emoji')
const roles = require('../../json/roles')
const db = require('../../Models/Eco')
const guild_settings = require('../../Models/GuildSettings')
const chalk = require('chalk');
const moment = require("moment")

const { Discord, EmbedBuilder } = require('discord.js');
const Logger = require("../../utils/logger");

client.on('voiceStateUpdate', async (oldState, newState) => {

    const ecolog = await client.channels.cache.get("970062741861707806");
    const ecodebug = await client.channels.cache.get("1024446278228254762");

    var hour = ('0' + moment().utcOffset(1).hours()).slice(-2)
    var minutes = ('0' + moment().minutes()).slice(-2)
    var seconds = ('0' + moment().seconds()).slice(-2)

    const start = Date.now()
    const guildID = `${newState.guild.id || oldState.guild.id}`
    const memberID = `${newState.member.id || oldState.member.id}`
    const settings = await guild_settings.findOne({ Guildid: guildID });
    const amountMoney = settings.ecoVCmoney



    if (settings.ecoVC == 1) {
        const data = await db.findOne({ Guildid: guildID, Memberid: memberID });
        //rejestracja nowego użytkownika
        if (!data) {
            databaseVC = await db.create({ Guildid: guildID, Memberid: memberID, Membertag: oldState.member.user.username, Money: 1, Lastmessagetime: Date.now(), Messagescount: 0, GoodMemeCount: 0, Lastvoicestatus: Date.now(), Voicecount: 0, XPupvote: 0, Upvotegettime: 0, Upvotecooldown: 0 })
            databaseVC.save()
            const update = await db.findOne({ Guildid: guildID, Memberid: memberID })
            Logger.log(chalk.green(`Zarejestrowano nową osobe`) + chalk.white(` | ${oldState.member.user.username}`), 'eco')
            const embed = new EmbedBuilder().setColor('Green').setDescription(`**Zarejestrowano nową osobe:** <@${newState.member.id}> **=>** ${update.Money.toFixed(2)}${emoji.jascoin}`)
            await ecolog.send({ embeds: [embed] })
        }
        if (newState.member.user.bot) return

        //jeżeli jest nowy kanał to...
        if (newState.channel) {
            //zarejestrowany użytkownik
            if (data) {

                //dołączenie do kanału gdzie była jedna osoba
                if (newState.channel != oldState.channel && newState.channel.members.filter((member) => !member.user.bot && member.user.id != newState.member.user.id).size === 1) {
                    //aktualizacja osoby która dołączyła
                    if (settings.Debug == 1) { Logger.log(chalk.green(`Powiększył VC, aktualizuje`) + chalk.white(` | ${newState.member.user.username}`), 'eco') }
                    await data.updateOne({ Lastvoicestatus: Date.now() })
                    //aktualizacja osoby która sama była na vc
                    const stateMembers = newState.channel.members.filter((member) => !member.user.bot && member.user.id != newState.member.user.id);
                    const UPDATEMEMBER = stateMembers.at(0)
                    if (settings.Debug == 1) { Logger.log(chalk.green(`Powiększono VC, aktualizuje`) + chalk.white(` | ${UPDATEMEMBER.user.username}`), 'eco') }

                    const dataUPDATE = await db.findOne({ Guildid: newState.guild.id, Memberid: UPDATEMEMBER.user.id });
                    await dataUPDATE.updateOne({ Lastvoicestatus: Date.now() })


                }
                //ten sam kanał, mute.
                if (newState.channel === oldState.channel && !oldState.mute && newState.mute) {
                    //antysolo
                    const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                    if (stateMembers.size >= 2 && newState.channel != newState.guild.afkChannel) {
                        const sum = Date.now() - data.Lastvoicestatus - Math.round(client.ws.ping)
                        const sumadd = (sum / 1000 / 60) * amountMoney

                        if (sum < 5000 && settings.Debug == 1) return Logger.log(chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`), 'eco')
                        if (settings.Debug == 1) { Logger.log(chalk.red(`Mute, zatrzymuje i dodaje ` + chalk.white(` | ${oldState.member.user.username} `) + chalk.green(` | +${sumadd.toFixed(2)} `)), 'eco') }

                        const vcadd = sum / 1000 / 60 / 60
                        await data.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, })

                        const updatedata = await db.findOne({ Memberid: newState.member.id })
                        const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${newState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                        await ecolog.send({ embeds: [embed] })

                        if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }
                    }
                }

                //ten sam kanał, unmute.
                if (newState.channel === oldState.channel && oldState.mute && !newState.mute) {
                    //antysolo
                    const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                    if (stateMembers.size >= 2 && newState.channel != newState.guild.afkChannel) {
                        if (settings.Debug == 1) { Logger.log(chalk.green(`Unmute, zaczynam liczyć od nowa`) + chalk.white(` | ${oldState.member.user.username}`), 'eco') }
                        await data.updateOne({ Lastvoicestatus: Date.now() })
                    }

                }
                //zmiana kanału
                if (oldState.channel != null && newState.channel != oldState.channel && !oldState.mute) {
                    if (oldState.channel && oldState.channel != newState.channel) {
                        //antysolo
                        const stateMembers = oldState.channel.members.filter((member) => !member.user.bot);

                        //update w przypadku wyjścia z AFK 
                        if (oldState.channel === newState.guild.afkChannel) {

                            await data.updateOne({ Lastvoicestatus: Date.now() })
                            if (settings.Debug == 1) { Logger.log(chalk.red(`Opuszczenie AFK, aktualizuje czas`) + chalk.white(` | ${newState.member.user.username}`), 'eco') }
                        }
                        //update w przypadku wyjścia z pustego kanału
                        if (stateMembers.size <= 0 && !oldState.mute) {

                            await data.updateOne({ Lastvoicestatus: Date.now() })
                            if (settings.Debug == 1) { Logger.log(chalk.red(`Opuszczenie pustego kanału, aktualizuje czas`) + chalk.white(` | ${newState.member.user.username}`), 'eco') }
                        }
                        //update w przypadku normalnej zmiany kanału
                        if (stateMembers.size > 0) {
                            const sum = Date.now() - data.Lastvoicestatus - Math.round(client.ws.ping)
                            const sumadd = (sum / 1000 / 60) * amountMoney

                            if (sum < 5000 && settings.Debug == 1) return Logger.log(chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`), 'eco')
                            if (settings.Debug == 1) { Logger.log(chalk.blue(`Zmienił VC, sumuje i dodaje` + chalk.white(` | ${oldState.member.user.username} `) + chalk.green(` | +${sumadd.toFixed(2)} `)), 'eco') }

                            const vcadd = sum / 1000 / 60 / 60
                            await data.updateOne({ Lastvoicestatus: Date.now(), $inc: { Money: sumadd, Voicecount: vcadd }, })

                            const updatedata = await db.findOne({ Memberid: newState.member.id })
                            const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${newState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                            await ecolog.send({ embeds: [embed] })

                            if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }
                        }
                    }
                }

                //dołączenie do kanału
                if (!oldState.channel && newState.channel && !newState.mute) {
                    //antysolo
                    const stateMembers = newState.channel.members.filter((member) => !member.user.bot);
                    if (stateMembers.size >= 1 && newState.channel != newState.guild.afkChannel) {
                        if (settings.Debug == 1) { Logger.log(chalk.green(`Dołączył VC, zaczynam liczyć`) + chalk.white(` | ${oldState.member.user.username}`), 'eco') }
                        await data.updateOne({ Lastvoicestatus: Date.now() })
                    }
                }
            }
        }

        //jeżeli jest stary kanał to...
        if (oldState.channel) {
            //potrzebne dane przy starym kanale

            if (data) {
                //opuścił VC na którym zostawił 1 osobe
                if (oldState.channel != newState.channel) {
                    //potrzebne dane
                    const stateMembers = await oldState.channel.members.filter((member) => !member.user.bot && member.user.id != newState.member.user.id);
                    const UPDATEMEMBER = stateMembers.at(0)
                    //aktualizacja osoby która sama była na vc

                    if (stateMembers.size === 1 && !UPDATEMEMBER.voice.mute && oldState.channel.id != oldState.channel.guild.afkChannel.id) {

                        const updatemember = await db.findOne({ Guildid: oldState.guild.id, Memberid: UPDATEMEMBER.id })
                        const sum = Date.now() - updatemember.Lastvoicestatus - Math.round(client.ws.ping)
                        const sumadd = (sum / 1000 / 60) * amountMoney

                        if (sum < 5000 && settings.Debug == 1) Logger.log(chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`), 'eco')
                        if (sum < 5000) return Logger.log(chalk.red(`Zostaje na kanale solo, zbyt krótki czas` + chalk.white(` | ${UPDATEMEMBER.user.username} `) + chalk.green(` | ${sum} `)), 'eco')

                        if (settings.Debug == 1) { await Logger.log(chalk.red(`Zostaje na kanale solo, sumuje i dodaje` + chalk.white(` | ${UPDATEMEMBER.user.username} `) + chalk.green(` | +${sumadd.toFixed(2)} `)), 'eco') }

                        const vcadd = sum / 1000 / 60 / 60
                        await updatemember.updateOne({ Lastvoicestatus: Date.now(), $inc: { Money: sumadd, Voicecount: vcadd }, })

                        const updatedata = await db.findOne({ Memberid: UPDATEMEMBER.user.id })
                        const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${UPDATEMEMBER.user.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                        await ecolog.send({ embeds: [embed] })
                        if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }

                    }
                }

                //opuścił VC
                if (oldState.channel && newState.channel === null && !oldState.mute && oldState.channel != oldState.guild.afkChannel) {
                    //antysolo
                    const stateMembers = oldState.channel.members.filter((member) => !member.user.bot);
                    if (stateMembers.size >= 1 && newState.channel != newState.guild.afkChannel) {
                        const sum = Date.now() - data.Lastvoicestatus - Math.round(client.ws.ping)
                        const sumadd = (sum / 1000 / 60) * amountMoney

                        if (sum < 5000 && settings.Debug == 1) return Logger.log(chalk.red(`${oldState.member.user.username} Zbyt krótki czas => ${sum}`), 'eco')
                        if (settings.Debug == 1) { Logger.log(chalk.red(`Opuścił VC, sumuje i dodaje` + chalk.white(` | ${oldState.member.user.username} `) + chalk.green(` | +${sumadd.toFixed(2)} `)), 'eco') }

                        const vcadd = sum / 1000 / 60 / 60
                        const addvalue = await db.findOne({ Guildid: guildID, Memberid: oldState.member.id })
                        await addvalue.updateOne({ $inc: { Money: sumadd, Voicecount: vcadd }, })
                        const updatedata = await db.findOne({ Memberid: newState.member.id })
                        const embed = new EmbedBuilder().setColor('Yellow').setDescription(`**Wpływ na konto:** <@${newState.member.id}> **=>** ${sumadd.toFixed(2)}${emoji.jascoin} **=>** ${updatedata.Money.toFixed(2)}${emoji.jascoin} | Za: **\`VoiceChannel\`**`)
                        await ecolog.send({ embeds: [embed] })

                        if (sumadd >= 100) { await ecodebug.send({ embeds: [embed] }) }
                    }
                }

            }
        }
    }
}
)
