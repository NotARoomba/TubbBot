module.exports = class DictionaryCommand extends Commando.Command {
	constructor(client) {
		super(client, {
            name: 'dictionary',
            aliases: ['d'],
			group: 'util',
			memberName: 'dictionary',
			description: 'Responds with information on a word.',
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to search for?',
					type: 'string',
				}
			]
		});
	}

	async run(message, { word }) {
        try {
			const { body } = await request
				.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
				.query({ key: process.env.WEBSTER });
			if (!body.length) return null;
			const data = body[0];
			if (typeof data === 'string') return null;
			return {
				name: data.meta.stems[0],
				partOfSpeech: data.fl,
				definiton: data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')
			};
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
    }
}
