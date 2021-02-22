const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    group: 'utility',
    description: 'Find your ping to me!',
    execute(message) {
        const waitEmbed = new Discord.MessageEmbed()
            .setColor('#ffc018')
            .setTitle(`Ping`)
            .setDescription(`:green_apple: Finding ping to bot... 
       
       :alarm_clock: Your ping is ${(Date.now() - message.createdTimestamp)} ms`)
        message.reply(waitEmbed)
    }
}