
const { list } = require('@util/util');
const codes = Object.keys(translate.languages).filter(code => typeof translate.languages[code] !== 'function');
module.exports = class TranslateCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['google-translate'],
			group: 'util',
			memberName: 'translate',
			description: 'Translates text to a specific language.',
			details: `**Codes:** ${codes.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Google Translate',
					reasonURL: 'https://translate.google.com/'
				}
			],
			args: [
				{
					key: 'target',
					prompt: `Which language would you like to translate to? Either ${list(codes, 'or')}.`,
					type: 'string',
					validate: target => {
						if (translate.languages.isSupported(target)) return true;
						return `Invalid target, please enter either ${list(codes, 'or')}.`;
					},
					parse: target => translate.languages.getCode(target)
				},
				{
					key: 'text',
					prompt: 'What text would you like to translate?',
					type: 'string',
					max: 500
				},
			]
		});
	}

	async run(message, { text, target }) {
		try {
			var base = 'auto'
			const { text: result, from } = await translate(text, { to: target, from: base });
			const embed = new Discord.MessageEmbed()
				.setColor(0x4285F4)
				.setFooter('Powered by Google Translate', 'https://i.imgur.com/h3RoHyp.png')
				.addField(`❯ From: ${translate.languages[from.language.iso]}`, from.text.value || text)
				.addField(`❯ To: ${translate.languages[target]}`, result);
			return message.embed(embed);
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};