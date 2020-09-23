const Discord = require('discord.js');
const Canvas = require('canvas');

const client = new Discord.Client();


module.exports = {
    commands: 'rank',
    description: 'I wanna be the very best...',
    callback: async (message, args) => {

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/757768055479861278/758090856325709885/bh.jpeg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    message.channel.send(attachment);
      

    }

};