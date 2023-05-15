const chalk = require('chalk');

const { EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const { connect, default: mongoose } = require('mongoose');
const client = require('../index');
const { dependencies } = require('../package.json');

const ver = dependencies['discord.js']; // Getting the Version of Discord.js
const mongooseConnectionString = process.env.MONGO_CONNECTION_URL; // Mongo Connection String
// Getting Connect from Mongoose
let ram;
setInterval(() => {
  ram = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);
}, 1000);
// const arrayOfStatus = [`${ram}`, 'Okto to #60', 'Simpuje Hiro <3', 'Ale bym kebaba zjadł', '#JY #JY #JY'];
const kuponMECZE = require('../Models/kuponMECZE');
const KuponyTOTAL = require('../Models/KuponyTOTAL');
const Logger = require('../utils/logger');

client.on('ready', async () => {
  // Presence
  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: `${ram}` }],
      status: 'online',
    });
  }, 15000);

  Logger.log('');
  Logger.log(chalk.red.bold('——————————[Statystyki]——————————'));
  Logger.log(
    chalk.white(`Uruchomiony na Node `) +
      chalk.green(process.version) +
      chalk.white(' na ') +
      chalk.yellow(`${process.platform} ${process.arch}`),
  );
  Logger.log(
    chalk.white('Pamięć: ') +
      chalk.green(`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}`) +
      chalk.white(' MB'),
  );
  Logger.log(
    chalk.white('RSS: ') +
      chalk.green(`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}`) +
      chalk.white(' MB'),
  );
  Logger.log(chalk.white('Discord.js Version: ') + chalk.green(ver));
  Logger.log('');
  Logger.log(chalk.red.bold('——————————[Połączenie]——————————'));
  Logger.log(
    chalk.white('✅ Pomyślnie połączono z ') +
      chalk.red(`${client.user.tag} `) +
      chalk.white('(') +
      chalk.green(client.user.id) +
      chalk.white(')'),
  );
  mongoose.set('strictQuery', false);
  connect(mongooseConnectionString, {}).then(
    Logger.log(chalk.white('✅ Pomyślnie połączono z ') + chalk.red(`Mongoose Data Base`)),
  );

  // papieżowa xD
  const BARKA_ZWROTKA1 = new EmbedBuilder()
    .setTitle(`21:37`)
    .setThumbnail(
      `https://media.discordapp.net/attachments/692829999681634354/1063200210366509129/image.png?width=762&height=497`,
    )
    .setColor('White')
    .setDescription(
      `**1.** \nPan kiedyś stanął nad brzegiem,\n` +
        `Szukał ludzi gotowych pójść za Nim;\n` +
        `By łowić serca\n` +
        `Słów Bożych prawdą.\n\n` +
        `**Ref.:** \nO Panie, to Ty na mnie spojrzałeś,\n` +
        `Twoje usta dziś wyrzekły me imię.\n` +
        `Swoją barkę pozostawiam na brzegu,\n` +
        `Razem z Tobą nowy zacznę dziś łów.`,
    );

  const BARKA_ZWROTKA2 = new EmbedBuilder()
    .setTitle(`21:37`)
    .setThumbnail(
      `https://media.discordapp.net/attachments/692829999681634354/1063200210366509129/image.png?width=762&height=497`,
    )
    .setColor('White')
    .setDescription(
      `**2.** \nJestem ubogim człowiekiem,\n` +
        `Moim skarbem są ręce gotowe\n` +
        `Do pracy z Tobą\n` +
        `I czyste serce.\n\n` +
        `**Ref.:** \nO Panie, to Ty na mnie spojrzałeś,\n` +
        `Twoje usta dziś wyrzekły me imię.\n` +
        `Swoją barkę pozostawiam na brzegu,\n` +
        `Razem z Tobą nowy zacznę dziś łów.\n\n`,
    );

  const BARKA_ZWROTKA3 = new EmbedBuilder()
    .setTitle(`21:37`)
    .setThumbnail(
      `https://media.discordapp.net/attachments/692829999681634354/1063200210366509129/image.png?width=762&height=497`,
    )
    .setColor('White')
    .setDescription(
      `**3.** \nTy, potrzebujesz mych dłoni,\n` +
        `Mego serca młodego zapałem\n` +
        `Mych kropli potu\n` +
        `I samotności.\n\n` +
        `**Ref.:** \nO Panie, to Ty na mnie spojrzałeś,\n` +
        `Twoje usta dziś wyrzekły me imię.\n` +
        `Swoją barkę pozostawiam na brzegu,\n` +
        `Razem z Tobą nowy zacznę dziś łów.\n\n`,
    );

  const BARKA_ZWROTKA4 = new EmbedBuilder()
    .setTitle(`21:37`)
    .setThumbnail(
      `https://media.discordapp.net/attachments/692829999681634354/1063200210366509129/image.png?width=762&height=497`,
    )
    .setColor('White')
    .setDescription(
      `**4.**\n Dziś wypłyniemy już razem\n` +
        `Łowić serca na morzach dusz ludzkich\n` +
        `Twej prawdy siecią\n` +
        `I słowem życia.\n\n` +
        `**Ref.:** \nO Panie, to Ty na mnie spojrzałeś,\n` +
        `Twoje usta dziś wyrzekły me imię.\n` +
        `Swoją barkę pozostawiam na brzegu,\n` +
        `Razem z Tobą nowy zacznę dziś łów\n`,
    );

  setInterval(async () => {
    const data = await kuponMECZE.find({ GuildID: '639632749610795009' });
    const update = await KuponyTOTAL.findOne({ GuildID: '639632749610795009' });
    const losse = await data
      .filter((x) => x.Status === '<:nie:1020115284549451786>' && x.Confirmed === true)
      .map((x) => x.BetValue)
      .reduce((sum, a) => sum + a, 0);

    const win = await data
      .filter((x) => x.Status === '<:tak:1020115278920691773>' && x.Confirmed === true)
      .map((x) => x.BetValue * x.Multipler)
      .reduce((sum, a) => sum + a, 0);

    if (!update) {
      const database = await KuponyTOTAL.create({
        GuildID: '639632749610795009',
        TotalWin: win,
        TotalLoss: losse,
      });
      database.save();
    } else {
      await update.updateOne({ TotalWin: win, TotalLoss: losse });
    }
  }, 1000 * 60 * 1);

  const ciszaON = new cron.schedule(
    '00 37 21 * * *',
    async () => {
      const ogolny = client.channels.cache.get('640277080721981442');
      ogolny.send({ embeds: [BARKA_ZWROTKA1] });
      setTimeout(() => {
        ogolny.send({ embeds: [BARKA_ZWROTKA2] });
      }, 15000);
      setTimeout(() => {
        ogolny.send({ embeds: [BARKA_ZWROTKA3] });
      }, 30000);
      setTimeout(() => {
        ogolny.send({ embeds: [BARKA_ZWROTKA4] });
      }, 45000);
    },
    null,
    false,
    'Europe/Warsaw',
  );
  ciszaON.start();
});
