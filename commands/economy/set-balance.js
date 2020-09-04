const economy = require('../../economy')

module.exports = {
    commands: ['setbalance', 'setbal'],
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<The target's @> <coin amount>",
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {
      const mention = message.mentions.users.first()
  
      if (!mention) {
        message.reply('Please tag a user to set their account to.')
        return
      }
  
      const coins = arguments[1]
      if (isNaN(coins)) {
        message.reply('Please provide a valid number of coins.')
        return
      }
  
      const guildId = message.guild.id
      const userId = mention.id
  
      const newCoins = await economy.addCoins(guildId, userId, coins)
  
      message.reply(
        `You have set <@${userId}>'s ${coins} account. They now have ${newCoins} coin(s)!`
      )
    },
  }