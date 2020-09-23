const Discord = require('discord.js')
const client = new Discord.Client()
const economy = require('@features/economy')

module.exports = {
  commands: 'pay',
  minArgs: 2,
  maxArgs: 2,
  description: 'Got Cash?',
  expectedArgs: "<Target user's @> <Amount of Tools>",
  callback: async (message, arguments, text) => {
    const { guild, member } = message

    const target = message.mentions.users.first()
    if (!target) {
      message.reply('Please specify someone to give Tools to.')
      return
    }

    const strandsToGive = arguments[1]
    if (isNaN(strandsToGive)) {
      message.reply('Please provide a valid number of Tools to give.')
      return
    }

    const strandsOwned = await economy.getCoins(guild.id, member.id)
    if (strandsOwned < strandsToGive) {
      message.reply(`You do not have ${strandsToGive} Tools!`)
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
        .setDescription(`You have given <@${target.id}> ${strandsToGive} Tools! They now have ${newBalance} Tools and you have ${remainingCoins} Tools!`)
    message.reply(payEmbed);
  },
}