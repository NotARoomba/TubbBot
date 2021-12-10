const { quotes } = require('../../assets/quotes.json')
const request = require('node-superfetch');
module.exports = {
	name: 'quote',
	group: 'utility',
	usage: `quote`,
	description: 'Gets a quote from someone.',
	async execute(message) {
		const { body } = await request.get(`https://goquotes-api.herokuapp.com/api/v1/random?count=1`);
		const data = body.quotes[0];
		message.channel.send(`${data.text} \n -${data.author}`)
	}
}