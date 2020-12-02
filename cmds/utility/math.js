const { Command } = require('discord.js-commando');
const math = require('mathjs');

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['mathematics', 'solve'],
			group: 'utility',
			memberName: 'math',
			description: 'Evaluates a math expression.',
			credit: [
				{
					name: 'mathjs',
					url: 'https://mathjs.org/',
					reason: 'Expression Parser'
				}
			],
			args: [
				{
					key: 'expression',
					prompt: 'What expression do you want to evaluate?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { expression }) {
		console.log(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
		try {
			const evaluated = math.evaluate(expression).toString();
			return msg.reply(evaluated).catch(() => msg.reply('Invalid expression.'));
		} catch {
			return msg.reply('Invalid expression.');
		}
	}
};