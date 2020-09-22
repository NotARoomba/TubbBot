const Canvas = require("discord-canvas"),
const client = new Discord.Client();
const Discord = require('discord.js')




module.exports = {
    commands: 'rank',
    description: 'I wanna be the very best...',
    callback: async (client, message, args) => {

        const image = await new Canvas.Goodbye()

        .setBackground("https://cdn.discordapp.com/attachments/757768055479861278/758090856325709885/bh.jpeg")
        .toAttachment();

        const attachment = new Discord.Attachment(image.toBuffer(), "goodbye-image.png");

    message.channel.send(attachment);
      

    }

};