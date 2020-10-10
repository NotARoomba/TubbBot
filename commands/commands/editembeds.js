const Discord = require('discord.js')
const client = new Discord.Client()


module.exports = {
    commands: ['test'],
    description: "Describes all of this bot's commands",
    callback: (message, arguments, text) => {

        const tstEmbed = new Discord.MessageEmbed()
	.setTitle('Some title')
	.setDescription('Description after the edit');
        
    message.reply(tstEmbed);
        
        const tstEmbed = new Discord.MessageEmbed()
	.setTitle('e')
	.setDescription('Description after the edit');

message.edit(tstEmbed);
    }
}