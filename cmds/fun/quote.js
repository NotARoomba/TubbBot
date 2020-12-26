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

        logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        const { channel } = message
        const quote2 = quotes[Math.floor(Math.random() * quotes.length)]
        const { author } = quote2
        const { quote } = quote2
        channel.send(`${quote} \n -${author}`)
    }
}