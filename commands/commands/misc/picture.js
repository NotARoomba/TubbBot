const Discord = require('discord.js');
const client = new Discord.Client();
const Canvas = require('canvas');



module.exports = {
    commands: ['picture', 'pic'],
    description: '*click click*',
    callback: async (message) => {
        
        const canvas = Canvas.createCanvas(700, 300);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v268batch2-kul-02_2.jpg?bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&q=80&usm=15&vib=3&w=1300&s=a5cfc956068e95f97f6df92d9d96439c')
        //const background = await Canvas.loadImage('https://www.fg-a.com/wallpapers/2020-black-crystalline-peaks-image.jpg')
        //const background = await Canvas.loadImage('')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#74037b';
	    ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px sans-serif';
	    ctx.fillStyle = '#00000';
	    ctx.fillText('Welcome to the server,', 200, 225);
        ctx.font = '25px sans-serif';
	    ctx.fillStyle = '#00000';
	    ctx.fillText(`${message.member.displayName}!`, 300, 250);
        ctx.beginPath();
        // Start the arc to form a circle
        ctx.arc(350, 110, 75, 0, Math.PI * 2, true);
        // Put the pen down
        ctx.closePath();
        // Clip off the region you drew on
        ctx.clip();
	const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg', size: 512}));
	// Draw a shape onto the main canvas
	ctx.drawImage(avatar, 275, 35, 150, 150);

        const picture = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        message.channel.send(picture);
    }
}