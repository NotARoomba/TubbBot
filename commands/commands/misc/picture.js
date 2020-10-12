const Discord = require('discord.js');
const client = new Discord.Client();
const Canvas = require('canvas');



module.exports = {
    commands: ['picture', 'pic'],
    description: '*click click*',
    callback: async (message) => {
        
        
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
        
            // Declare a base size of the font
            let fontSize = 85;
        
            do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `${fontSize -= 10}px sans-serif`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (ctx.measureText(text).width > canvas.width - 300);
        
            // Return the result to use in the actual canvas
            return ctx.font;
        };
        
        
        
        
        
        const canvas = Canvas.createCanvas(700, 300);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v268batch2-kul-02_2.jpg?bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&q=80&usm=15&vib=3&w=1300&s=a5cfc956068e95f97f6df92d9d96439c')
        //const background = await Canvas.loadImage('')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#74037b';
	    ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.font = '32px sans-serif';
	    ctx.fillStyle = '#00000';
	    ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);
        ctx.font = '60px sans-serif';
	    ctx.fillStyle = '#00000';
	    ctx.fillText(`${message.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
        ctx.beginPath();
        // Start the arc to form a circle
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        // Put the pen down
        ctx.closePath();
        // Clip off the region you drew on
        ctx.clip();
	const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg', size: 512}));
	// Draw a shape onto the main canvas
	ctx.drawImage(avatar, 25, 25, 200, 200);

        const picture = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        message.channel.send(picture);
    }
}