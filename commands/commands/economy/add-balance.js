const economy = require('@features/economy')

module.exports = {
  commands: ['addbalance', 'addbal'],
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<The target's @> <Strand amount>",
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const mention = message.mentions.users.first() 
    
    if (!mention) {
      message.reply('Please tag a user to add Strands to.')
      return
    }

    const strands = arguments[1]
    if (isNaN(strands)) {
      message.reply('Please provide a valid number of Strands.')
      return
    }

    const guildId = message.guild.id
    const userId = mention.id

    const newCoins = await economy.addCoins(guildId, userId, strands)

    message.reply(
      `You have given <@${userId}> ${strands} Strand(s). They now have ${newCoins} Strand(s)!`
    )
  },
}