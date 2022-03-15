const { play } = require('./play');
const { isValidCommander, updateQueue } = require('../../function.js')
module.exports = {
	name: 'back',
	group: 'music',
	usage: 'play (stuff)',
	aliases: ['b'],
	description: 'Play back the previous song!',
	async execute(message, args, client) {
		if (isValidCommander(message) !== true) return
if (message.guild.musicData.previous.length == 0) return message.reply("there is nothing to go back to!")
message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
message.guild.musicData.queue.unshift(message.guild.musicData.previous[message.guild.musicData.previous.length - 1] == message.guild.musicData.nowPlaying ? message.guild.musicData.previous[message.guild.musicData.previous.length - 2] : message.guild.musicData.previous[message.guild.musicData.previous.length - 1])
		await play(message, message.guild.musicData.voiceChannel, client)
		await updateQueue(message, client)
		message.react("⏮️");
	}
}