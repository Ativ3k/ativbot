const client = require('../../index');
const {
    Client,
    CommandInteraction,
    Message,
    ActionRowBuilder,
    ButtonBuilder,
    WebhookClient,
    ApplicationCommandType,
    ApplicationCommandOptionType,
} = require('discord.js');
require("dotenv").config();
const votedb = require('../../Models/DBuserVote')
const rekrutacja = require('../../Models/DBrekrutacja')

client.on('modalSubmit', async (modal) => {

    if (modal.customId === 'rekrutacja') {
        const name = modal.getTextInputValue('name')
        const Discord = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setAuthor({ name: `${name} aka ${modal.user.username}`, iconURL: modal.user.displayAvatarURL(), })
            .setThumbnail(`${modal.user.displayAvatarURL()}`)
            .setDescription("**Cześć! Jestem `" + name + "`")
            .setFooter({
                text: `ID: ${modal.user.id}`,
            })

        const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('Tak')
                .setStyle('Success')
            )
            .addComponents(new ButtonBuilder()
                .setCustomId('idk')
                .setLabel('Nie wiem')
                .setStyle('PRIMARY')
            )
            .addComponents(new ButtonBuilder()
                .setCustomId('no')
                .setLabel('Nie')
                .setStyle('Danger')
            )
        const Rchannel = client.channels.cache.get("692829999681634354")



        await Rchannel.send({ embeds: [embed], components: [row] })
        Rchannel.messages.fetch({ limit: 1 }).then(messages => {
            const lastMessage = messages.first();

            const voteid = lastMessage.id



            votedb.findOne({
                Uid: modal.user.id,
                MessId: voteid,
            }, (err, data) => {
                if (!data)
                    new votedb({
                        Gid: modal.guild.id,
                        Uid: modal.user.id,
                        MessId: voteid,
                        yes: 0,
                        idk: 0,
                        no: 0,
                    }).save()
            })
        })

    }
})
