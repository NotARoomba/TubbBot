const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
    commands: 'help',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        const helpEmbed = new Discord.MessageEmbed()
.setColor('#00FF00')
.setTitle(`Store`)
.setDescription(`This is the store!.

List of Items:

Robot = 0 Strands

More items in development!`)

message.reply(helpEmbed);
    }
}