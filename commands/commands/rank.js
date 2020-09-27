const Discord = require('discord.js');
const levels = require('@features/levels')
const client = new Discord.Client()

module.exports = {
  commands: 'rank',
  maxArgs: 1,
  description: 'I wanna be, the very best...',
  expectedArgs: "<Target user's @>",
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id

    
    const level = await levels.getNeededXP(guildId, userId)
    

    const rankEmbed = new Discord.MessageEmbed()
        .setColor('#000080')
        .setTitle(`Rank`)
        .setDescription(`Your level is ${level}`)

      message.reply(rankEmbed)
  },
}