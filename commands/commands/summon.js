const Discord = require('discord.js')
const client = new Discord.Client()
const summoned = '427630841045319701'

module.exports = {
    commands: 'summon',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        
        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Kys`)
        .setdescription(`<@${summoned}>`)

    message.reply(summonEmbed)  
    }
}