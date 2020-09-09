const Discord = require('discord.js')
const client = new Discord.Client()
//const summoned = '427630841045319701'

module.exports = {
    commands: 'summon',
    maxArgs: 1,
    expectedArgs: "[Target user's @]",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {
        const target = message.mentions.users.first()
        const userId = target.id
        if (!target) {
      const balusrEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`Error`)
            .setDescription('Please tag a user to Summon.')
            return
        }
      
      message.reply(balusrEmbed)
  

        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Summon`)
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