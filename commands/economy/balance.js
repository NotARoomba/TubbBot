const economy = require('../economy')

module.exports = {
    name: 'bal',
    description: "this is the bal command!",
    execute(message, args){
        const target = message.mentions.users.first() || message.author
        const targetId = target.targetId


        const guildId = message.guild.guildId
        const userId = target.id

       const coint = await economy.getCoins(guildId, userId)
        
        message.reply(`That user has ${coins} coins`)
    },
}
