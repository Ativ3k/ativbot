const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const emoji = require('../../json/emoji.json');
const dbGR = require('../../Models/GroupCreate');
const dbMBR = require('../../Models/GroupMember');

module.exports = {
  name: 'grouptest',
  description: 'groupstest',
  type: ApplicationCommandType.ChatInput,
  dm_permission: 0,
  userPermissions: 'Administrator',
  defaultMemberPermissions: 'Administrator',
  options: [
    {
      name: 'create',
      type: ApplicationCommandOptionType.String,
      description: 'Nazwa grupy',
      required: false,
    },
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {Message} message
   * @raturns
   */

  run: async (client, interaction) => {
    const dataMBRgrp = await dbGR.findOne({
      GroupServerID: interaction.guild.id,
      GroupMembers: interaction.member.id,
    });
    const dataMBR = await dbMBR.findOne({
      GroupServerID: interaction.guild.id,
      GroupMemberID: interaction.member.id,
    });
    const groupname = interaction.options.getString('create');

    if (!groupname) {
      if (!dataMBR) {
        const embed = new EmbedBuilder().setDescription(`Nie należysz do żadnej grupy!`).setColor('#FFFFFF');
        return interaction.reply({ embeds: [embed] });
      }
      if (dataMBR) {
        const embed = new EmbedBuilder()
          .setTitle(`${dataMBRgrp.GroupName}`)
          .setDescription(
            `${emoji.DATA} ${dataMBRgrp.GroupCreatedAt}\n${emoji.peepoGladHat} <@${dataMBRgrp.GroupOwner}>\n${
              emoji.jascoin
            } ${dataMBRgrp.GroupCoins || '0'}`,
          )
          .setColor('#FFFFFF')
          .setFooter({ text: `${dataMBRgrp.GroupName}` });

        return interaction.reply({ embeds: [embed] });
      }
    }

    if (groupname) {
      await dbGR
        .create({
          GroupServerID: interaction.guild.id,
          GroupName: groupname,
          GroupCreatedAt: Date.now(),
          GroupOwner: interaction.member.id,
          GroupMembers: interaction.member.id,
          GroupCoins: 0,
          GroupCoinsLogs: [],
        })
        .save();

      await dbMBR
        .create({
          GroupServerID: interaction.guild.id,
          GroupMemberID: interaction.member.id,
          GroupNameMember: interaction.member.username,
          GroupJoinedAt: Date.now(),
          GroupLeavedAt: 0,
          GroupDonatedCoins: 0,
          GroupDonatedCoinsLogs: [],
        })
        .save();

      const updatedata = await dbGR.findOne({
        GroupServerID: interaction.guild.id,
        GroupName: groupname,
      });
      console.log(updatedata.GroupName);
      const embed = new EmbedBuilder()
        .setDescription(
          `${emoji.TAK} Pomyślnie utworzono grupe.\nNazwa: ${updatedata.GroupName}\nWłaściciel: <@${updatedata.GroupOwner}>`,
        )
        .setColor('#FFFFFF')
        .setFooter({ text: `${updatedata.GroupName}` });

      await interaction.reply({ embeds: [embed] });
    }
    return 0;
  },
};
