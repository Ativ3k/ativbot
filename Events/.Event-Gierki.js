const client = require("../index"); 
const {
    owners
} = require('../json/owners.json'); // Get the owner ids
var cron = require("node-cron");
const emoji = require('../json/emoji.json')
const moment = require("moment")
const gierkidb = require('../Models/Gierki')

const { Discord, EmbedBuilder } = require('discord.js');

client.on("ready", async () => {
    const gierki = [
        "970797823987699773",
        "736455324206104640",
        "736455337904832612",
        "736455359014764674",
        "736455355768242237",
        "736455320796266550",
        "736455334838796289",
        "736455331672227910",
        "872091864994566184",
        "872092402146504734",
        "736455328149012500",
        "736455343646703707",
        "872092714202697758",
        "872092763112505394",
        "736455365415272560",
        "872092550343835688",
        "736455362122874941",
        "872092817198043216",
        "640337080152490005"
    ];

    client.on("messageCreate", async (message) => {
        const date = new Date()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()

        if (message.author.bot) return
        const time = 5
        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + time)
        const timeleft = expires.setMinutes(expires.getMinutes()) / 1000
        const TIME = time * 1000 * 60
        const gry = client.channels.cache.get("679785385999859884");

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`${emoji.TIMEOUT} **Wysłano na przerwe** <@${message.author.id}>.\n${emoji.MEMBER} **Przez:** <@${client.user.id}>\n${emoji.DATA} **Kończy się:** <t:${parseInt(timeleft)}:R>\n${emoji.NOTE} **Powód:** **\`Zakaz pingowania rang gier w godzinach 23:00 - 7:00.\`**`)
            .setFooter({ text: `${message.author.id} + ${message.author.tag}` })
        const DM = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`${emoji.TIMEOUT} **Zostałeś wysłany na przerwę!**.\n${emoji.MEMBER} **Przez:** <@${client.user.id}>\n${emoji.DATA} **Kończy się:** <t:${parseInt(timeleft)}:R>\n${emoji.NOTE} **Powód:** **\`Zakaz pingowania rang gier w godzinach 23:00 - 7:00.\`**`)
            .setFooter({ text: `${message.author.id} + ${message.author.tag}` })
        const ativ = client.channels.cache.get("692829999681634354");
        const ativID = "258891606873210880"


        const OFF = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${emoji.TIME} **\`CISZA NOCNA\`** ${emoji.TIME}\n${emoji.INFO} **Cisza nocna zakończona!**\n${emoji.GLADHAT} Miłego dnia seksowne gnojki. `)

        const ON = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${emoji.TIME} **\`CISZA NOCNA\`** ${emoji.TIME}\n${emoji.INFO} Od godziny **23:00** do godziny **7:00** pingowanie ról gier jest __zabronione__!`)


        const logON = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${emoji.TIME} **Czas:** \`${hour}:${minutes}:${seconds}\``)

        if (message.author.id === ativID && message.content === "!embedon") {
            message.channel.send({ embeds: [ON] })
        }
        else if (message.author.id === ativID && message.content === "!embedoff") {
            message.channel.send({ embeds: [OFF] })
        }
        if (message.author.id === ativID && message.content === "!time") {
            message.channel.send({ embeds: [logON] })
        }
        if (message.author.id === ativID && message.content === "!testall") {
            message.channel.send({ embeds: [logON] })
            message.channel.send({ embeds: [ON] })
            message.channel.send({ embeds: [OFF] })
        }


        var len = gierki.length
        for (var i = 0; i < len; i++) {
            if (message.channel === gry && message.content.includes(gierki[i])) {
                if (hour >= 23 || hour < 7) {
                    console.log(hour)
                    gry.send({ embeds: [embed] })
                    const TARGET = message.guild.members.cache.get(message.author.id)
                    TARGET.timeout(TIME, "Zakaz pingowania rang gier w godzinach 23:00 - 7:00.")
                    // const alllog = client.channels.cache.get("988342883138551828");
                    // alllog.send({ content: `${emoji.TIME} <@${TARGET}> złamał cisze nocną!` })
                    message.author.send({ embeds: [DM] })
                }
            }
        }



    })

    const ON = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${emoji.TIME} **\`CISZA NOCNA\`** ${emoji.TIME}\n${emoji.INFO} Od godziny **23:00** do godziny **7:00** pingowanie ról gier jest __zabronione__!`)


    let ciszaON = new cron.schedule('00 00 23 * * *', async () => {
        const data = await gierkidb.findOne({ GuildID: "639632749610795009", })

        const gry = client.channels.cache.get("679785385999859884");
        await gry.send({ embeds: [ON] })
        await gry.messages.fetch({ limit: 1 }).then(async messages => {
            const botmsg = messages.first()
            if (data) {
                if (data.MessID) { gry.messages.fetch(`${data.MessID}`).then(msg => msg.delete()) }
                data.delete()
            }
            if (!data) {
                database = await gierkidb.create({
                    GuildID: "639632749610795009",
                    MessID: botmsg.id,
                })
                database.save()
            }
        })

    }, null, false, "Europe/Warsaw");
    ciszaON.start()

    const OFF = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`${emoji.TIME} **\`CISZA NOCNA\`** ${emoji.TIME}\n${emoji.INFO} **Cisza nocna zakończona!**\nMiłego dnia seksowne gnojki. ${emoji.GLADHAT}`)

    let ciszaOFF = new cron.schedule('00 00 07 * * *', async () => {
        const data = await gierkidb.findOne({ GuildID: "639632749610795009", })

        const gry = client.channels.cache.get("679785385999859884");
        await gry.send({ embeds: [OFF] })
        await gry.messages.fetch({ limit: 1 }).then(async messages => {
            const botmsg = messages.first()
            if (data) {
                if (data.MessID) { gry.messages.fetch(`${data.MessID}`).then(msg => msg.delete()) }
                data.delete()
                database = await gierkidb.create({
                    GuildID: "639632749610795009",
                    MessID: botmsg.id,
                })
                database.save()
            }
            if (!data) {
                database = await gierkidb.create({
                    GuildID: "639632749610795009",
                    MessID: botmsg.id,
                })
                database.save()
            }
        })
    }, null, false, "Europe/Warsaw");
    ciszaOFF.start()

    const date = new Date()
    var hour = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    
    const ativ = await client.channels.fetch("692829999681634354");
    const logON = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription(`👋 **Wstałem!**\n${emoji.TIME} **Czas:** \`${hour}:${minutes}:${seconds}\``)
    await ativ.send({ embeds: [logON] })


})


