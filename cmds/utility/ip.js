const Discord = require('discord.js');
const axios = require('axios')
module.exports = {
	name: 'ip',
	group: 'utility',
	usage: `ip (ip)`,
	description: 'Responds with information on an ip.',
	async execute(message, ip) {
		try {
			await axios
				.get(`http://api.ipstack.com/${ip}?access_key=${process.env.IP_STACK}&output=json`)
				.then((response) => {
					const data = response.data
					if (data.longitude == null || undefined) {
						message.reply(`That is not a valid ip`)
						return
					}
					const embed = new Discord.MessageEmbed()
						.setColor('#484848')
						.setTitle(`Results for: ${data.ip}`)
						.setThumbnail(`https://www.countryflags.io/${data.country_code}/flat/64.png`)
						.addField('Country', data.country_name, true)
						.addField('State', data.region_name, true)
						.addField('City', data.city, true)
						.addField('Zip Code', data.zip, true)
						.addField('Latitude', data.longitude, true)
						.addField('Longitude', data.latitude, true)
					return message.channel.send(embed);
				}, (error) => {
					console.log(error);
				})
		} catch (err) {
			if (err.status === 404) return message.channel.send('Could not find any results.');
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
}