const { getQueues } = require("../../function.js")
const { play } = require("./play.js")
const Pagination = require('discord-paginationembed');
module.exports = {
	name: 'loadqueue',
	group: 'music',
	usage: 'loadqueue (position of queue)',
	aliases: ['load'],
	description: 'Loads a saved queue!',
	async execute(message, args, client) {
		try {
			let queues = await getQueues(message, client)
			if (queues.length == 0) return message.reply("you have no saved queues!")
			if (isNaN(Number(args))) return message.reply(`that is not a number.`)
			const queueEmbed = new Pagination.FieldsEmbed()
				.setArray(queues)
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setElementsPerPage(10)
				.formatField('# - Song', function (e) {
					return `**${queues.indexOf(e) + 1}**:  ${e[0][0]}`;
				});
			queueEmbed.embed.setColor('#dbc300').setTitle('Saved Queues');
			queueEmbed.build();
			if (args == 0 || args > queues.length || args.includes('.')) return message.reply(`that is not a valid queue position.`);
			const musicData = message.guild.musicData
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				message.reply('please join a voice channel and try again!');
				return;
			}
			musicData.voiceChannel = voiceChannel
			args = parseInt(args) - 1
			message.guild.musicData.queue = queues[args][1]
			if (message.guild.musicData.songDispatcher !== null) {
				message.guild.musicData.songDispatcher.end();
			}
			message.guild.musicData.previous.push(message.guild.musicData.nowPlaying)
			message.guild.musicData.nowPlaying = message.guild.musicData.queue[0]
			await play(message, message.guild.musicData.voiceChannel)
			message.channel.send(`Loaded queue **${queues[args][0]}**`)
		} catch (err) {
			console.log(err)
			message.channel.send(`There was an error loading the queue, \`\`\`${err}\`\`\``)
		}
	}
}