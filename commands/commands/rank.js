const { MessageAttachment } = require("discord.js");
const Canvas = require('canvas');
const client = new Discord.Client();



module.exports = {
    commands: 'rank',
    description: 'I wanna be the very best...',
    callback: async (client, message, args) => {

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('@root/wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    }
  }