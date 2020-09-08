const Discord = require('discord.js');
const economy = require('../../economy')

module.exports = {
  commands: ['balance', 'bal'],
  maxArgs: 1,
  expectedArgs: "[Target user's @]",
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id

    const strands = await economy.getCoins(guildId, userId)

    message.reply(`That user has ${strands} Strands!`)
  },
}
