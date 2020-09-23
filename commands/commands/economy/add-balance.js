const economy = require('@features/economy')
const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
  commands: ['addbalance', 'addbal'],
  minArgs: 2,
  maxArgs: 2,
  description: 'Money for the Admins!',
  expectedArgs: "<The target's @> <Coin amount>",
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const mention = message.mentions.users.first() 
    
    if (!mention) {
      
      const balusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please tag a user to add Tools to.')

      
      message.reply(balusrEmbed)
      return
    }

    const coins = arguments[1]
    if (isNaN(coins)) {
      
      const balsadEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please provide a valid number of Tools.')
      
      message.reply(balsadEmbed)
      return
    }

    const guildId = message.guild.id
    const userId = mention.id

    const newCoins = await economy.addCoins(guildId, userId, coins)

    const balyesEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle(`Success`)
    .setDescription(`You have given <@${userId}> ${coins} Strand(s). They now have ${newCoins} Strand(s)!`)

    
    message.reply(balyesEmbed)
  },
}