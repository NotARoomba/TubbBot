const Discord = require('discord.js')
const { createProgressBar } = require('../../function.js')
module.exports = {
	name: 'nowplaying',
	group: 'music',
	usage: 'nowplaying',
	aliases: ['np'],
	description: 'Display the currently playing song!',
	async execute(message) {
		if (message.guild.musicData.isPlaying !== true) return message.reply(`there is nothing playing.`)
		let track = message.guild.musicData.nowPlaying
		const embed = new Discord.MessageEmbed()
			.setColor(track.color)
			.setTitle(`:notes: ${track.title}`)
			.setThumbnail(track.thumbnail)
			.setURL(track.url)
			.setDescription(`${createProgressBar(message)}`)
    .setFooter(`Requested by ${track.memberDisplayName}!`, track.memberAvatar);
		message.channel.send(embed);
	}
}