const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'summon',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        
        const summonEmbed = new Discord.MessageEmbed()
        .setColor('#9400D3')
        .setTitle(`Ritual of Kys`)
        .setDescription('@kys and i oop')

    message.reply(summonEmbed)  
    }
}