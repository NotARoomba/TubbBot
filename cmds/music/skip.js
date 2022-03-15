const { isValidCommander, updateQueue } = require("../../function");
module.exports = {
	name: 'skip',
	group: 'music',
	usage: 'skip',
	aliases: ['s'],
	description: 'Skip the current playing song!',
	async execute(message, e, client) {
		if (isValidCommander(message) !== true) return
		message.guild.musicData.loopSong = false;
		await message.guild.musicData.songDispatcher.end();
		message.react("👌");
	}
}