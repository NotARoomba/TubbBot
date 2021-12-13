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
			message.guild.me.voice.channel.leave()
		} catch (err) {
			console.log(err)
		}
		message.channel.send(':wave:');
	}
}