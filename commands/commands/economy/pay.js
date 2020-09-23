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


    const coinsToGive = arguments[1]
    if (isNaN(coinsToGive)) {
      message.reply('Please provide a valid number of Strands to give.')
      return
    }

    const coinsOwned = await economy.getCoins(guild.id, member.id)
    if (coinsOwned < coinsToGive) {
      message.reply(`You do not have ${coinsToGive} Strands!`)

      return
    }

    const remainingCoins = await economy.addCoins(
      guild.id,
      member.id,
      coinsToGive * -1
    )
    const newBalance = await economy.addCoins(guild.id, target.id, coinsToGive)
    const payEmbed = new Discord.MessageEmbed()
        .setColor('#00FFFF')
        .setTitle(`Pay`)
        .setDescription(`You have given <@${target.id}> ${coinsToGive} Strands! They now have ${newBalance} Strands and you have ${remainingCoins} Strands!`)

    message.reply(payEmbed);
  },
}