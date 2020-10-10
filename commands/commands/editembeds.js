const Discord = require('discord.js')
const client = new Discord.Client()


module.exports = {
    commands: ['test'],
    description: "Describes all of this bot's commands",
    callback: (message, arguments, text) => {

        const Embed = new Discord.MessageEmbed()
        .setDescription(":one:")

    const newEmbed = new Discord.MessageEmbed()
        .setDescription(":two:")

    // Edit Part Below
    var Msg = await message.channel.send(Embed); // sends message
    Msg.edit(newEmbed) // edits message with newembed
    }
}