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
				const name = data.meta.stems[0]
				const partOfSpeech = data.fl
                const definiton = data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')
                message.say(`${name} \n ${partOfSpeech} \n ${definiton}`)
            
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
    }
}
