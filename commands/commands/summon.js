const Discord = require('discord.js')
const client = new Discord.Client()
const summoned = '427630841045319701'

module.exports = {
    commands: 'summon',
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {
        
        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Kys`)
        .setDescription(`<@${summoned}>`)
        

    message.reply(summonEmbed)  

    const summoningEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setDescription(`<@${summoned}>`)
        

    message.reply(summoningEmbed)
    message.reply(summoningEmbed)
    message.reply(summoningEmbed)
    message.reply(summoningEmbed) 
    }
}