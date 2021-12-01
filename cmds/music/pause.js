const { isValidCommander } = require('../../function.js')
module.exports = {
	name: 'pause',
	group: 'music',
	usage: 'pause',
	description: 'Pause the current playing song!',
	async execute(message) {
		if (isValidCommander(message) !== true) return
		message.guild.musicData.songDispatcher.pause();
		message.react("⏸️")
	}
}