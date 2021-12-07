const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');
module.exports = {
	name: 'translate',
	group: 'utility',
	usage: `translate (target language code) (text to translate)`,
	description: 'Translates text to a specific language.',
	async execute(message, args) {
		if (!args) return message.reply(`usage: <language code to translate to (the 2 letter code)> <text to translate>. Check -help translate for more info. Language Codes -> (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)`)
		var i = args.indexOf(' ');
		args = [args.slice(0, i), args.slice(i + 1)];
		try {
			var base = 'auto'
			const { text: result, from } = await translate(args[1], { to: args[0], from: base });
			const embed = new Discord.MessageEmbed()
				.setColor(0x4285F4)
				.setFooter('Powered by Google Translate', 'https://i.imgur.com/h3RoHyp.png')
				.addField(`From: ${translate.languages[from.language.iso]}`, from.text.value || args[1])
				.addField(`To: ${translate.languages[args[0]]}`, result);
			return message.reply(embed);
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try a different language code as noted here (use command without arguments to view usage): (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)`);
		}
	}
}