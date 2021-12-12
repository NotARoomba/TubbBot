const { saveQueue } = require("../../function.js")
module.exports = {
	name: 'savequeue',
	group: 'music',
	usage: 'savequeue (optional name)',
	aliases: ['sq'],
	description: 'Saves the current song queue!',
	async execute(message, args, client) {
		try {
			if (message.guild.musicData.queue.length == 0) return message.reply(`There are no songs in queue!`)
			if (args == "") return message.reply("Specify a name for the queue.")
			await saveQueue(message, client, args)
			message.react("👍")
		} catch (err) {
			message.channel.send(`There was an error saving the queue, \`\`\`${err}\`\`\``)
		}
	}
}