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

	const background = await Canvas.loadImage('@root/wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	

	channel.send(`Welcome to the server, ${member}! Please read ${member.guild.channels.cache.get(rules).toString()}. Thank you for joining this server and we hope you have a good time!`, attachment);
});
  
      
}
