const { quotes } = require('../../assets/quotes.json')
module.exports = {
	name: 'quote',
	group: 'utility',
	usage: `quote`,
	description: 'Gets a quote from someone.',
	execute(message) {
		const { channel } = message
		const quote2 = quotes[Math.floor(Math.random() * quotes.length)]
		const { author } = quote2
		const { quote } = quote2
		channel.send(`${quote} \n -${author}`)
	}
}