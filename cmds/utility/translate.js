const { Command } = require('discord.js-commando');
const { list } = require('@util/util');
const codes = Object.keys(translate.languages).filter(code => typeof translate.languages[code] !== 'function');
module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['google-translate'],
			group: 'utility',
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
					key: 'base',
					prompt: `Which language would you like to use as the base? Either ${list(Object.keys(codes), 'or')}.`,
					type: 'string',
					default: 'auto',
					validate: base => {
						if (translate.languages.isSupported(base)) return true;
						return `Invalid base, please enter either ${list(codes, 'or')}.`;
					},
					parse: base => translate.languages.getCode(base)
				},
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
	async run(message, { base, target, text }) {
		const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
		try {
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