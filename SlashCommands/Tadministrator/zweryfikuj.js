const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  CommandInteraction,
} = require("discord.js");
const emoji = require("../../json/emoji.json");

module.exports = {
  name: "zweryfikuj",
  description: "Weryfikuje użytkownika",
  userPermissions: "Administrator",
  defaultMemberPermissions: "Administrator",
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "Wybierz użytkownika",
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @param {String} args
   * @raturns
   */
  run: async (client, interaction) => {
    const member = interaction.options.getMember("user");
    const user = interaction.options.getUser("user");
    const create = user.createdTimestamp / 1000;
    const join = member.joinedTimestamp / 1000;
    const hasRole = member.roles.cache.some(
      (r) => r.id === "872256489199394876"
    );
    const memberR = member.roles;
    const osiemnascie = client.channels.cache.get("796367204660412478");
    const logs = client.channels.cache.get("1033484270808875049");

    const usun = [
      "870797338124361739",
      "870796969424072737",
      "871917132118638592",
    ];
    const dodaj = ["872256489199394876", "686205735868432390"];
    const logi = new EmbedBuilder()
      .setTitle(`Weryfikacja +18`)
      .setDescription(
        `${emoji.VERIFY} **\`Kto:\`** ${interaction.member.user} (${interaction.member.user.id})\n❓ **\`Kogo:\`** ${member} (${member.id})`
      )
      .setColor("FF0000");

    if (!hasRole) {
      member
        .send({
          content: `Gratulacje ${member}! \nPrzeszedłeś weryfikacje i uzyskałeś dostęp do kanału <#796367204660412478>.`,
        })
        .catch(console.error);
      interaction.reply({
        content: `${emoji.SUCCESS} ${member} został zweryfikowany!`,
        ephemeral: true,
      });
      const serverJoin = Number(join).toFixed(0);
      const discordJoin = Number(create).toFixed(0);
      logs
        .send({ embeds: [logi] })
        .then(
          memberR.add(dodaj),
          memberR.remove(usun),

          osiemnascie.send(
            `**\`Witamy nową osobę w gronie zweryfikowanych i dorosłych!\`** 😄
            ${member} dołączył na discord <t:${discordJoin}:R> a na nasz serwer <t:${serverJoin}:R>.
            Czuj się jak u siebie! ${emoji.pepelove}`
          )
        )
        .catch(console.error);
    } else if (hasRole) {
      interaction
        .reply({
          content: `${member} jest już zweryfikowany!`,
          ephemeral: true,
        })
        .catch(console.error);
    }
  },
};
