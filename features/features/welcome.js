const Discord = require('discord.js')
const client = new Discord.Client()
const Canvacord = require("canvacord");
client.canvas = new Canvacord();

module.exports = (client) => {
    // welcome channel
    const rules = '757769773148012655'  // rules and info
    //const roles = '751559736096456885'
    
    client.on("guildMemberAdd", member => {
      const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome', 'welcome-channel')
          
  const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`Welcome to ${server}`, canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');

	channel.send(`Welcome to the server, ${member}! Please read ${member.guild.channels.cache.get(rules).toString()}. Thank you for joining this server and we hope you have a good time!`, attachment);
});
  
      
}
