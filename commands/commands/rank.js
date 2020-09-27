const Discord = require('discord.js');
const levels = require('@features/levels')
const client = new Discord.Client()

module.exports = {
  commands: 'rank',
  maxArgs: 1,
  description: 'I wanna be, the very best...',
  expectedArgs: "[Target user's @]",
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id

    const xp = await xp(guildId, userId)
    const level = await level(guildId, userId)
    const getNeededXP = await getNeededXP(guildId, userId)

    const rankEmbed = new Discord.MessageEmbed()
        .setColor('#000080')
        .setTitle(`Rank`)
        .setDescription(`Your level is ${level} with ${xp} XP out of ${getNeededXP()}`)

      message.reply(rankEmbed)
  },
}