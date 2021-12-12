const Pagination = require('discord-paginationembed');
module.exports = {
	name: 'queue',
	group: 'music',
	usage: 'queue',
	aliases: ['song-list', 'next-songs', 'q'],
	description: 'Display the song queue!',
	async execute(message) {
		try {
			const queueClone = message.guild.musicData.queue;
			if (queueClone.length == 0) throw err
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