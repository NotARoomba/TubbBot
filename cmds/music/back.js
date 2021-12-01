const { play } = require('./play');
const { isValidCommander, updateQueue } = require('../../function.js')
module.exports = {
	name: 'back',
	group: 'music',
	usage: 'play (stuff)',
	aliases: ['b'],
	description: 'Play back the previous song!',
	async execute(message, e, client) {
		if (isValidCommander(message) !== true) return
		message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
		message.guild.musicData.queue.unshift(message.guild.musicData.previous[message.guild.musicData.previous.length - 1] == message.guild.musicData.nowPlaying ? message.guild.musicData.previous[message.guild.musicData.previous.length - 2] : message.guild.musicData.previous[message.guild.musicData.previous.length - 1])
		await play(message, message.guild.musicData.voiceChannel)
		await updateQueue(message, client)
		message.react("⏮️");
	}
}