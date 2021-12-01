const { isValidCommander } = require('../../function.js')
module.exports = {
	name: 'loopqueue',
	group: 'music',
	usage: 'loopqueue',
	aliases: ['lq'],
	description: 'Toggles queue loop!',
	async execute(message) {
		if (isValidCommander(message) !== true) return
		else if (message.guild.musicData.queue.length == 0) {
			message.say(`I can't loop over an empty queue!`);
			return;
		} else if (message.guild.musicData.loopSong) {
			message.reply('Turn off the **loop** command before using the **loopqueue** command');
			return;
		}
		else if (message.guild.musicData.loopQueue) {
			message.guild.musicData.loopQueue = false;
			message.channel.send(':repeat: The queue is no longer playing on **loop**');
		}
		else {
			message.guild.musicData.loopQueue = true;
			message.channel.send(':repeat: The queue is now playing on **loop**');
		}
	}
}