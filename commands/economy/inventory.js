const Discord = require('discord.js');
const economy = require('../../economy')

module.exports = {
  commands: ['inventory', 'inv'],
  maxArgs: 1,
  expectedArgs: "[Target user's @]",
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id

    const inventoryItems = await economy.getCoins(guildId, userId)

    message.reply(`That user has ${inventoryItems}!`)
  },
}