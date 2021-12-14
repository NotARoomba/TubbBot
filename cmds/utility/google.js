const Discord = require('discord.js');
const googleIt = require('google-it');
module.exports = {
	name: 'google',
	group: 'utility',
	usage: `google (query)`,
	aliases: ['g'],
	description: `Searches Google for something!`,
	async execute(message, args) {
		const colors = ['4285f4', 'ea4335', 'fbbc05', '34a853']
		googleIt({ 'query': args, 'no-display': true }).then(results => {
			for (let i = 0; i < 5; i++) {
				const element = results[i];
				const embed = new Discord.MessageEmbed()
					.setTitle(element.title)
					.setURL(element.link)
					.setColor(colors[Math.floor(Math.random() * colors.length)])
					.setDescription(element.snippet)
				message.channel.send(embed)
			}
		}).catch(e => { })
	}
}