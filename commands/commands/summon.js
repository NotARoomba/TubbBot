const Discord = require('discord.js')
const client = new Discord.Client()
//const summoned = '427630841045319701'

module.exports = {
    commands: 'summon',
    maxArgs: 1,
    expectedArgs: "[Target user's @]",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildId = message.guild.id
    const userId = target.id
      
      const balusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please tag a user to SUMMON.')

      
      message.reply(balusrEmbed)
  

        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Kys`)
        .setDescription(`<@${userId}>`)
        

    message.reply(summonEmbed)  

    const summoningEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setDescription(`<@${userId}>`)
        

    message.reply(summoningEmbed)
    message.reply(summoningEmbed)
    message.reply(summoningEmbed)
    message.reply(summoningEmbed) 
    }
}