const request = require('node-superfetch');
module.exports = {
	name: 'giphy',
	group: 'utility',
	usage: `giphy (query)`,
	aliases: ['gif'],
	permission: ['EMBED_LINKS'],
	description: 'Searches Giphy for your query.',
	async execute(message, query) {
		try {
			const { body } = await request
				.get('http://api.giphy.com/v1/gifs/search')
				.query({
					q: query,
					api_key: process.env.GIPHY_KEY,
					rating: message.channel.nsfw ? 'r' : 'pg'
				});
			if (!body.data.length) return message.reply('could not find any results.');
			return message.channel.send(body.data[Math.floor(Math.random() * body.data.length)].images.original.url);
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
}
