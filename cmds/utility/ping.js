const Discord = require('discord.js')
module.exports = {
    name: 'ping',
    execute(message) {
        const waitEmbed = new Discord.MessageEmbed()
            .setColor('#ffc018')
            .setTitle(`Ping`)
            .setDescription(`:green_apple: Finding ping to bot... 
       
       :alarm_clock: Your ping is ${(Date.now() - message.createdTimestamp) / 100} ms`)
        message.reply(waitEmbed)
    }
}