const economy = require('../economy')

module.exports = {
    commands: ('bal', 'balance'),
    maxArgs: 1,
    expectedArgs: "[Target user's @]",
    callback: async (message) => {
        const target = message.mentions.users.first() || message.author
        const targetId = target.targetId


        const guildId = message.guild.guildId
        const userId = target.id

       const coint = await economy.getCoins(guildId, userId)
        
        message.reply(`That user has ${coins} coins`)
    },
}
