const { isValidCommander, updateQueue } = require('../../function.js')
module.exports = {
	name: 'clear',
	group: 'music',
	usage: 'play (stuff)',
	aliases: ['clearqueue', 'skipall'],
	description: 'Clears the queue!',
	async execute(message, e, client) {
		if (isValidCommander(message) !== true) return
		if (!message.guild.musicData.queue[0]) return message.reply('there are no songs in queue!');
		message.guild.musicData.queue.length = 0;
		message.guild.musicData.queue = [];
		message.guild.musicData.loopSong = false;
		message.guild.musicData.loopQueue = false;
		await updateQueue(message, client)
		message.react("👌");
	}
}