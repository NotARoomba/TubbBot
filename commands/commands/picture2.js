const Discord = require('discord.js');
const Canvas = require('canvas');
const client = new Discord.Client();


module.exports = {
    commands: ['picture2', 'pic2'],
    description: '*click click*',
    callback: async message => {
        const canvas = Canvas.createCanvas(700, 300);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v268batch2-kul-02_2.jpg?bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&q=80&usm=15&vib=3&w=1300&s=a5cfc956068e95f97f6df92d9d96439c')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText('test', canvas.width / 2.5, canvas.height / 1.8);
        const welcome = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        message.channel.send(welcome);
    }
}