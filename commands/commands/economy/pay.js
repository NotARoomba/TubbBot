const Discord = require('discord.js')
const client = new Discord.Client()
const economy = require('@features/economy')

module.exports = {
  commands: 'pay',
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<Target user's @> <Amount of Strands>",
  callback: async (message, arguments, text) => {
    const { guild, member } = message

    const target = message.mentions.users.first()
    if (!target) {
      message.reply('Please specify someone to give Strands to.')
      return
    }

    const strandsToGive = arguments[1]
    if (isNaN(strandsToGive)) {
      message.reply('Please provide a valid number of Strands to give.')
      return
    }

    const strandsOwned = await economy.getCoins(guild.id, member.id)
    if (strandsOwned < strandsToGive) {
      message.reply(`You do not have ${strandsToGive} Strands!`)
      return
    }

    const remainingCoins = await economy.addCoins(
      guild.id,
      member.id,
      strandsToGive * -1
    )
    const newBalance = await economy.addCoins(guild.id, target.id, strandsToGive)
    const payEmbed = new Discord.MessageEmbed()
        .setColor('#00FFFF')
        .setTitle(`Pay`)
        .setDescription(`You have given <@${target.id}> ${strandsToGive} Strands! They now have ${newBalance} Strands and you have ${remainingCoins} Strands!`)
    message.reply(payEmbed);
  },
}