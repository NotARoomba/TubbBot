const { formatNumber } = require('@util/util');
module.exports = class CountryCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'country',
			group: 'util',
			memberName: 'country',
			description: 'Responds with information on a country.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Rest Countries',
					url: 'https://restcountries.eu/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What country would you like to search for?',
					type: 'string',
					parse: query => encodeURIComponent(query)
				}
			]
		});
	}

	async run(message, { query }) {

		client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
		try {
			const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${query}`);
			const data = body[0];
			const embed = new Discord.MessageEmbed()
				.setColor('#484848')
				.setTitle(data.name)
				.setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
				.addField('❯ Population', formatNumber(data.population), true)
				.addField('❯ Capital', data.capital || 'None', true)
				.addField('❯ Currency', data.currencies[0].symbol, true)
				.addField('❯ Location', data.subregion || data.region, true)
				.addField('❯ Demonym', data.demonym || 'None', true)
				.addField('❯ Native Name', data.nativeName, true)
				.addField('❯ Area', `${formatNumber(data.area)}km`, true)
				.addField('❯ Languages', data.languages.map(lang => lang.name).join('/'));
			return message.embed(embed);
		} catch (err) {
			if (err.status === 404) return message.say('Could not find any results.');
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};