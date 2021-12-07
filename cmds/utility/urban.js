const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'urban',
	group: 'utility',
	usage: `weather (query)`,
	aliases: ['ud', 'urbandictionary'],
	description: 'Get definitions from urban dictonary.',
	execute(message, text) {
		fetch(`https://api.urbandictionary.com/v0/define?term=${text}`)
			.then(res => res.json())
			.then(json => {
				const embed = new Discord.MessageEmbed()
					.setColor('#f0c018')
					.setTitle(`${text}`)
					.setAuthor('Urban Dictionary', 'https://i.imgur.com/vdoosDm.png', 'https://urbandictionary.com')
					.setDescription(`*${json.list[Math.floor(Math.random() * 1)].definition}*`)
					.setURL(json.list[0].permalink)
					.setTimestamp()
					.setFooter('Powered by UrbanDictionary', message.client.user.displayAvatarURL());
				message.channel.send(embed);
				return;
			})
			.catch(() => {
				message.channel.send('Failed to deliver definition.'); 
				return;
			});
	}
};