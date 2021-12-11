const { getQueues } = require("../../function.js")
module.exports = {
	name: 'listqueues',
	group: 'music',
	usage: 'listqueue',
	aliases: ['list'],
	description: 'Saves the current song queue!',
	async execute(message, args, client) {
		try {
			await getQueues(message, client)
			message.react("👍")
		} catch (err) {
			message.channel.send(`There was an error getting the queue, \`\`\`${err}\`\`\``)
		}
	}
}