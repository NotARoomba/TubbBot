const Discord = require('discord.js');
const levels = require('@features/levels');
const client = new Discord.Client()


module.exports = {
    commands: 'rank',
    minArgs: 0,
    maxArgs: 0,
    description: 'I wanna be, the very best...',
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author
        const targetId = target.id
    
        const guildId = message.guild.id
        const userId = target.id
    
        const xp = await levels.xp(guildId, userId)
    
        const balEmbed = new Discord.MessageEmbed()
            .setColor('#000080')
            .setTitle(`Balance`)
            .setDescription(`Your rank ${level} with ${xp} experience! You now need ${getNeededXP(level)} XP to level up again.`)
          message.reply(balEmbed)
      },
}

