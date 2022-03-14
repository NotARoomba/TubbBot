const { updateQueue } = require("../../function.js");
module.exports = {
	name: 'leave',
	group: 'music',
	usage: 'leave',
	aliases: ['stop'],
	description: 'Leaves voice channel if in one!',
	async execute(message, args, client) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply('Please join a voice channel and try again!');
			return false
		} else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
			message.reply(`You must be in the same voice channel as the bot's in order to use that!`);
			return false
		}
		try {
			message.guild.musicData.loopQueue = false;
			await updateQueue(message, client)
			message.guild.musicData.queue.length = 0
    message.guild.musicData.songDispatcher.disconnect()
      message.guild.musicData.songDispatcher = undefined;
		} catch (err) {
			message.guild.musicData.loopQueue = false;
      await updateQueue(message, client)
			message.guild.musicData.queue.length = 0
			message.guild.me.voice.channel.leave()
       message.guild.musicData.songDispatcher = undefined;
		}
		message.channel.send(':wave:');
	}
}