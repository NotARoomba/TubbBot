const { Command } = require('discord.js-commando');
const request = require('node-superfetch');
const { GiphyKey } = require('@root/config.json');

module.exports = class GiphyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giphy',
			aliases: ['gif'],
            group: 'fun',
			memberName: 'giphy',
			description: 'Searches Giphy for your query.',
			credit: [
				{
					name: 'GIPHY',
					url: 'https://giphy.com/',
					reason: 'API',
					reasonURL: 'https://developers.giphy.com/'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What GIF would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('http://api.giphy.com/v1/gifs/search')
				.query({
					q: query,
					api_key: GiphyKey,
					rating: msg.channel.nsfw ? 'r' : 'pg'
				});
			if (!body.data.length) return msg.say('Could not find any results.');
			return msg.say(body.data[Math.floor(Math.random() * body.data.length)].images.original.url);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};