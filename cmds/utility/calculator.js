const Discord = require('discord.js');
var math = require('mathjs')
//const WolframAlphaAPI = require('wolfram-alpha-api');
//const waApi = WolframAlphaAPI(process.env.WOLFRAM);
//https://products.wolframalpha.com/api/libraries/javascript/
module.exports = {
	name: "calculator",
	group: 'utility',
	usage: `calc (expression)`,
	aliases: ['calc'],
	description: 'Get the answer to a math problem.',
	async execute(message, args) {
		try {
			message.channel.send(`\`\`\`${await calc(args)}\`\`\``)
			async function calc(equation) {
				return await math.evaluate(equation);
			}
		} catch (err) {
			message.reply(`An error occured \`${err}\``)
		}
	}
}