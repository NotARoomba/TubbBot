
module.exports = class MathCommand extends Commando.Command {
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

	run(message, { expression }) {
		const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
		try {
			const evaluated = math.evaluate(expression).toString();
			return message.reply(evaluated).catch(() => message.reply('Invalid expression.'));
		} catch {
			return message.reply('Invalid expression.');
		}
	}
};