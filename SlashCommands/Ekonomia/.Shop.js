const {
  AttachmentBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandType,
} = require('discord.js');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const Canvas = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { join } = require('path');
const emoji = require('../../json/emoji.json');

GlobalFonts.registerFromPath(join('./SlashDEV/DEV/fonts/FEASFBI_.TTF'), 'poszukiwacz');
GlobalFonts.registerFromPath(join('./SlashDEV/DEV/fonts/Top Secret.ttf'), 'topsecret');
GlobalFonts.registerFromPath(join('./SlashDEV/DEV/fonts/Marker SD.ttf'), 'markersd');
GlobalFonts.registerFromPath(join('./SlashDEV/DEV/fonts/AutourOne-Regular.otf'), 'AutourOne-Regular');
const db = require('../../Models/Shop');

module.exports = {
  name: 'sklep',
  description: 'ekonomiatest',
  defaultMemberPermissions: 'KickMembers',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */

  run: async (client, interaction, args) => {
    await interaction.deferReply();
    const data = await db.findOne({ Guildid: interaction.guild.id });
    const canvas = createCanvas(1000, 1000);
    const context = canvas.getContext('2d');
    const backgroundFile = await readFile('./SlashDEV/Ekonomia/png/background.png');

    const background = new Canvas.Image();
    background.src = backgroundFile;
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const wrapText = function (context, text, x, y, maxWidth, lineHeight) {
      // First, start by splitting all of our text into words, but splitting it into an array split by spaces
      const words = text.split(' ');
      let line = ''; // This will store the text of the current line
      let testLine = ''; // This will store the text when we add a word, to test if it's too long
      const lineArray = []; // This is an array of lines, which the function will return

      // Lets iterate over each word
      for (let n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
          // Then the line is finished, push the current line into "lineArray"
          lineArray.push([line, x, y]);
          // Increase the line height, so a new line is started
          y += lineHeight;
          // Update line and test line to use this word as the first word on the next line
          line = `${words[n]} `;
          testLine = `${words[n]} `;
        } else {
          // If the test line is still less than the max width, then add the word to the current line
          line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
          lineArray.push([line, x, y]);
        }
      }
      // Return the line array
      return lineArray;
    };
    console.log(data.item2price);
    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item1price}`, 55, 275);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item2price}`, 55, 580);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item3price}`, 55, 890);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item4price}`, 395, 275);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item5price}`, 395, 580);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item6price}`, 395, 890);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item7price}`, 735, 275);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item8price}`, 735, 580);

    context.font = '20px AutourOne-Regular';
    context.fillStyle = '#ffbe00';
    context.fillText(`Cena: ${data.item9price}`, 735, 890);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item1name}`, 55, 150);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item2name}`, 395, 150);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item3name}`, 735, 150);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item4name}`, 55, 455);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item5name}`, 395, 455);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item6name}`, 735, 455);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item7name}`, 55, 765);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item8name}`, 395, 765);

    context.font = '25px AutourOne-Regular';
    context.fillStyle = '#5555ff';
    context.fillText(`${data.item9name}`, 735, 765);

    // let wrappedText = wrapText(context, `ITEM1`, 55, 150, 10, 25);
    // wrappedText.forEach(function (item) {
    //     // item[0] is the text
    //     // item[1] is the x coordinate to fill the text at
    //     // item[2] is the y coordinate to fill the text at
    //     context.fillText(item[0], item[1], item[2]);
    // })

    context.font = '70px AutourOne-Regular';

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
      name: 'background.png',
    });
    const embed = new EmbedBuilder()
      .setTitle(`Sklep "Kuweta Jaśka"`)
      .setImage('attachment://background.png')
      .setColor('Random');

    const firstline = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('disableshop1').setStyle('Danger').setDisabled(true).setEmoji(`${emoji.NIE}`),
      )
      .addComponents(new ButtonBuilder().setCustomId('shopchoice1').setStyle('Success').setEmoji('1️⃣'))
      .addComponents(new ButtonBuilder().setCustomId('shopchoice2').setStyle('Success').setEmoji('2️⃣'))
      .addComponents(new ButtonBuilder().setCustomId('shopchoice3').setStyle('Success').setEmoji('3️⃣'))
      .addComponents(
        new ButtonBuilder().setCustomId('disableshop2').setStyle('Danger').setDisabled(true).setEmoji(`${emoji.NIE}`),
      );
    const secondline = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('disableshop3').setStyle('Danger').setDisabled(true).setEmoji(`${emoji.NIE}`),
      )
      .addComponents(new ButtonBuilder().setCustomId('shopchoice4').setStyle('Success').setEmoji('4️⃣'))
      .addComponents(new ButtonBuilder().setCustomId('shopchoice5').setStyle('Success').setEmoji('5️⃣'))
      .addComponents(new ButtonBuilder().setCustomId('shopchoice6').setStyle('Success').setEmoji('6️⃣'))
      .addComponents(
        new ButtonBuilder().setCustomId('disableshop4').setStyle('Danger').setDisabled(true).setEmoji(`${emoji.NIE}`),
      );
    const thirdline = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('disableshop5').setStyle('Danger').setDisabled(true).setEmoji(`${emoji.NIE}`),
      )
      .addComponents(new ButtonBuilder().setCustomId('shopchoice7').setStyle('Success').setEmoji('7️⃣'))
      .addComponents(new ButtonBuilder().setCustomId('shopchoice8').setStyle('Success').setEmoji('8️⃣'))
      .addComponents(new ButtonBuilder().setCustomId('shopchoice9').setStyle('Success').setEmoji('9️⃣'))
      .addComponents(
        new ButtonBuilder().setCustomId('disableshop6').setStyle('Danger').setDisabled(true).setEmoji(`${emoji.NIE}`),
      );

    await interaction.followUp({
      embeds: [embed],
      files: [attachment],
      components: [firstline, secondline, thirdline],
    });
  },
};
