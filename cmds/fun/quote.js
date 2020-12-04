const { quotes } = require('@assets/quotes.json')
module.exports = class GiphyCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'quote',
            group: 'fun',
			memberName: 'quote',
			description: 'Gets a quote form someone.',
		});
    }
    async run(message) {
        const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
        const { channel } = message
        const quote2 = quotes[Math.floor(Math.random() * quotes.length)]
        const { author } = quote2
        const { quote } = quote2
        channel.send(`${quote} \n -${author}`)
}
}