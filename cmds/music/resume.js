const { isValidCommander } = require('../../function.js')
module.exports = {
	name: 'resume',
	group: 'music',
	usage: 'resume',
	description: 'Resume the current playing song!',
	async execute(message) {
		if (isValidCommander(message) !== true) return
    message.guild.musicData.songDispatcher.pause();
		message.guild.musicData.songDispatcher.resume();
		message.guild.musicData.songDispatcher.resume();
    message.guild.musicData.songDispatcher.pause();
		message.guild.musicData.songDispatcher.resume();
		message.guild.musicData.songDispatcher.resume();
		message.react("▶️")
	}
}