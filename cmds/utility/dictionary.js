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
                const definition = data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')
            const info = new Discord.MessageEmbed()
			.setColor('#f0c018')
			.setFooter('Powered by Merriam-Webster', 'https://merriam-webster.com/assets/mw/static/social-media-share/mw-logo-245x245@1x.png')
            .setTitle(`${name}, ${partOfSpeech}`)
            .setDescription(definition)
			message.channel.send(info)
                //message.say(`${name} \n ${partOfSpeech} \n ${definiton}`)
            
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
    }
}