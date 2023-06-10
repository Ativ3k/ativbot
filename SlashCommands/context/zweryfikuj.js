const { EmbedBuilder } = require('discord.js');
const emoji = require('../../json/emoji.json');

module.exports = {
  name: '✔ Zweryfikuj',
  type: 2,
  userPermissions: 'Administrator',
  dm_permission: 0,
  defaultMemberPermissions: 'Administrator',
  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const member = interaction.options.getMember('user');
    const user = interaction.options.getUser('user');
    const create = user.createdTimestamp / 1000;
    const join = member.joinedTimestamp / 1000;
    const hasRole = member.roles.cache.some((r) => r.id === '872256489199394876');
    if (hasRole) {
      return interaction.reply({
        content: `<@${member}> jest już zweryfikowany!`,
        ephemeral: true,
      });
    }
    const usun = ['870797338124361739', '870796969424072737', '871917132118638592'];
    const dodaj = ['872256489199394876', '686205735868432390'];

    const logi = new EmbedBuilder()
      .setDescription(
        `${emoji.VERIFY} **\`Kto:\`** ${interaction.member.user} (${interaction.member.user.id})` +
          `❓ **\`Kogo:\`** ${member} (${member.id})`,
      )
      .setColor('FF0000');

    member
      .send({
        content: `Gratulacje <@${member}>!\nPrzeszedłeś weryfikacje i uzyskałeś dostęp do kanału <#796367204660412478>.`,
      })
      .catch((error) => {
        if (!error) {
          const DM = `${emoji.INFO} Otrzymał DM`;
          interaction.reply({
            content: `${emoji.SUCCESS} ${member} został zweryfikowany!\n${DM}`,
            ephemeral: true,
          });
        } else if (error) {
          const DM = `${emoji.INFO} Użytkownik ma zablokowane DM! Nie otrzymał powiadomienia na PW`;
          interaction.reply({
            content: `${emoji.SUCCESS} ${member} został zweryfikowany!\n${DM}`,
            ephemeral: true,
          });
        }
      });
    const logs = client.channels.cache.get('1033484270808875049');
    logs.send({ embeds: [logi] });
    member.roles.add(dodaj);
    member.roles.remove(usun);
    return client.channels.cache
      .get('796367204660412478')
      .send(
        `**\`Witamy nową osobę w gronie zweryfikowanych i dorosłych!\`** 😄\n` +
          `<@${member}> dołączył na discord <t:${Number(create)}:R>\n` +
          `a na nasz serwer <t:${Number(join)}:R>.\n` +
          `Czuj się jak u siebie! <:peepoLove:708661445885296661>`,
      );
  },
};
