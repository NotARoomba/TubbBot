const Discord = require('discord.js');
const { formatNumber } = require('../../function.js');
const request = require('node-superfetch');
module.exports = {
	name: "country",
	group: 'utility',
	usage: `country (country)`,
	description: 'Responds with information on a country.',
	async execute(message, query) {
		try {
			query => encodeURIComponent(query)
			const { body } = await request.get(`https://restcountries.com/v3.1/name/${query}`);
			const data = body[0];
			const embed = new Discord.MessageEmbed()
				.setColor('#484848')
				.setTitle(`${data.name.common} (${data.name.official})`)
				.setThumbnail(data.flags.png)
				.addField('Population', formatNumber(data.population), true)
				.addField('Capital', data.capital || 'None', true)
				.addField('Currency', Object.values(data.currencies)[0].symbol, true)
				.addField('Location', data.subregion || data.region, true)
				.addField('Demonym', data.demonyms.eng.f || 'None', true)
				.addField('Native Name', Object.values(data.name.nativeName).map(n => Object.values(n)).join('/'), true)
				.addField('Area', `${formatNumber(data.area)}km`, true)
				.addField('Languages', Object.values(data.languages).map(lang => lang).join('/'));
			return message.reply(embed);
		} catch (err) {
			if (err.status === 404) return message.channel.send('Could not find any results.');
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
}