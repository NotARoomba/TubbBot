const { isValidCommander, updateQueue } = require('../../function.js')
module.exports = {
	name: 'remove',
	group: 'music',
	usage: 'remove (queued song number)',
	description: 'Remove a specific song from the queue!',
	async execute(message, args, client) {
		if (isValidCommander(message) !== true) return
		if (isNaN(Number(args))) return message.reply(`that is not a number.`)
		queue = message.guild.musicData.queue
		if (args == 0 || args > queue.length || args.includes('.')) return message.reply(`that is not a valid queued song.`);
    let name = queue[args - 1].title
		queue.splice(args - 1, 1);
		await updateQueue(message, client)
		message.channel.send(`:wastebasket: Removed \`${name}\`` from queue!`);
	}
}