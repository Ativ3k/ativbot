const client = require('../../index');
const emoji = require('../../json/emoji.json');
const db = require('../../Models/Eco');
const shopdb = require('../../Models/Shop');

client.on('interactionCreate', async (interaction) => {
  const data = await db.findOne({
    Guildid: interaction.guild.id,
    Memberid: interaction.member.id,
  });
  const shop = await shopdb.findOne({ Guildid: interaction.guild.id });
  const tag = Math.floor(Math.random() * 10) + 1;
  if (interaction.customId === 'shopchoice1') {
    if (data.Money < shop.item1price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item1name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item1price) {
      await data.updateOne({
        $inc: { Money: -shop.item1price },
        $push: { Inventory: `${shop.item1name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item1name}** za ${shop.item1price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice2') {
    if (data.Money < shop.item2price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item2name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item2price) {
      await data.updateOne({
        $inc: { Money: -shop.item2price },
        $push: { Inventory: `${shop.item2name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item2name}** za ${shop.item2price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice3') {
    if (data.Money < shop.item3price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item3name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item3price) {
      await data.updateOne({
        $inc: { Money: -shop.item3price },
        $push: { Inventory: `${shop.item3name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item3name}** za ${shop.item3price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice4') {
    if (data.Money < shop.item4price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item4name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item4price) {
      await data.updateOne({
        $inc: { Money: -shop.item4price },
        $push: { Inventory: `${shop.item4name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item4name}** za ${shop.item4price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice5') {
    if (data.Money < shop.item5price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item5name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item5price) {
      await data.updateOne({
        $inc: { Money: -shop.item5price },
        $push: { Inventory: `${shop.item5name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item5name}** za ${shop.item5price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice6') {
    if (data.Money < shop.item6price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item6name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item6price) {
      await data.updateOne({
        $inc: { Money: -shop.item6price },
        $push: { Inventory: `${shop.item6name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item6name}** za ${shop.item6price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice7') {
    if (data.Money < shop.item7price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item7name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item7price) {
      await data.updateOne({
        $inc: { Money: -shop.item7price },
        $push: { Inventory: `${shop.item7name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item7name}** za ${shop.item7price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice8') {
    if (data.Money < shop.item8price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item8name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item8price) {
      await data.updateOne({
        $inc: { Money: -shop.item8price },
        $push: { Inventory: `${shop.item8name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item8name}** za ${shop.item8price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'shopchoice9') {
    if (data.Money < shop.item9price) {
      return interaction.reply({
        content: `Nie masz wystarczająco ${emoji.jascoin} aby kupić **${shop.item9name}**!`,
        ephemeral: true,
      });
    }
    if (data.Money > shop.item9price) {
      await data.updateOne({
        $inc: { Money: -shop.item9price },
        $push: { Inventory: `${shop.item9name}||**#${tag}**||` },
      });
      return interaction.reply({
        content: `Pomyślnie kupiono **${shop.item9name}** za ${shop.item9price}${emoji.jascoin}!`,
        ephemeral: true,
      });
    }
  }
  return 0;
});
