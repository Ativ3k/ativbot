const client = require("../index"); 
const {
    dependencies
} = require('../package.json'); 

const Canvas = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');

client.on("ready", async () => {
async function setbanner() {
    const guild = client.guilds.cache.get("639632749610795009")

    const bans1k = await guild.bans.fetch();
    last1k = bans1k.last().user.id
    const bans2k = await guild.bans.fetch({ after: `${last1k}` });
    last2k = bans2k.last().user.id
    const bans3k = await guild.bans.fetch({ after: `${last2k}` });

    const totalbans = (bans2k.size + bans1k.size + bans3k.size)
    const memberCount = guild.memberCount;
    const boostCount = guild.premiumSubscriptionCount

    const canvas = Canvas.createCanvas(960, 540);
    const context = canvas.getContext('2d');
    const pasekFile = await readFile('./SlashCommands/dev/pasek.png');
    const backgroundFile = await readFile('./SlashCommands/dev/banner.png');
    const nitroFile = await readFile('./SlashCommands/dev/nitro.png');
    const membersFile = await readFile('./SlashCommands/dev/members.png');
    const banFile = await readFile('./SlashCommands/dev/ban.png');

    var d = new Date();

    context.strokeStyle = '#0099ff';
    context.strokeRect(0, 0, canvas.width, canvas.height);

    const background = new Canvas.Image();
    background.src = backgroundFile;
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const pasek = new Canvas.Image();
    pasek.src = pasekFile
    context.drawImage(pasek, 36, 240, 883, 77);
    context.drawImage(pasek, 36, 350, 748, 77);
    context.drawImage(pasek, 36, 460, 610, 77);

    const nitro = new Canvas.Image();
    nitro.src = nitroFile;
    context.drawImage(nitro, 36, 460, 72, 72);

    const ban = new Canvas.Image();
    ban.src = banFile;
    context.drawImage(ban, 36, 350, 72, 72);

    const members = new Canvas.Image();
    members.src = membersFile;
    context.drawImage(members, 36, 240, 72, 72);

    context.font = 'bold 60px Sans-Serif';
    context.fillStyle = '#2C2F33';
    context.fillText(`${memberCount} członków`, 130, 296);
    context.fillText(`${totalbans} zbanowanych`, 130, 406);
    context.fillText(`${boostCount} ulepszeń`, 130, 517);

    const dataurl = canvas.toBuffer('image/png')
    await guild.setBanner(dataurl)
}
setInterval(() => {
    setbanner()
}, 300000)
})
