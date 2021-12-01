const { isValidCommander } = require('../../function.js')
module.exports = {
	name: 'loop',
	group: 'music',
	usage: 'loop',
	aliases: ['l', 'repeat'],
	description: 'Toggles song loop!',
	async execute(message) {
		if (isValidCommander(message) !== true) return
		if (message.guild.musicData.loopQueue) {
			message.reply('Turn off the **loopqueue** command before using the **loop** command');
			return;
		} else if (message.guild.musicData.loopSong) {
			message.guild.musicData.loopSong = false;
			message.channel.send(`**${message.guild.musicData.nowPlaying.title}** is no longer playing on repeat :repeat: `);
		}
		else {
			message.guild.musicData.loopSong = true;
			message.channel.send(`**${message.guild.musicData.nowPlaying.title}** is now playing on repeat :repeat: `);
		}
	}
}