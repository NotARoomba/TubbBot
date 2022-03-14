const Pagination = require('discord-paginationembed');
const { getQueue } = require("../../function.js");
module.exports = {
	name: 'queue',
	group: 'music',
	usage: 'queue',
	aliases: ['song-list', 'next-songs', 'q'],
	permission: ['MANAGE_MESSAGES'],
	description: 'Display the song queue!',
	async execute(message, args, client) {
		try {
			const dbqueue = await getQueue(message, client) 
			const queueClone = message.guild.musicData.queue.length == 0 && dbqueue.length !== message.guild.musicData.queue.length + 1? dbqueue : message.guild.musicData.queue;
			console.log("Queue", (await getQueue(message, client)).length, message.guild.musicData.queue.length)
      if (queueClone.length == 0) throw err;
			const queueEmbed = new Pagination.FieldsEmbed()
				.setArray(queueClone)
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setElementsPerPage(10)
				.formatField('# - Song', function (e) {
					return `**${queueClone.indexOf(e) + 1}**:  ${e.title}`;
				});
			queueEmbed.embed.setColor('#dbc300').setTitle('Music Queue');
			queueEmbed.build();
		} catch (err) {
			message.reply(`There are no songs in queue!`)
		}
	}
}