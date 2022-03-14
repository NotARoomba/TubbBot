const Pagination = require('discord-paginationembed');
const { isValidCommander, updateQueue, shuffleQueue } = require("../../function");
module.exports = {
	name: 'shuffle',
	group: 'music',
	usage: 'shuffle',
	permission: ['MANAGE_MESSAGES'],
	description: 'Shuffle the music queue!',
	async execute(message, args, client) {
		if (isValidCommander(message) !== true) return
    if (message.guild.musicData.queue.length == 0) return message.reply('there are no songs in queue!');
		shuffleQueue(message.guild.musicData.queue);
		let queue = message.guild.musicData.queue
		const queueClone = queue;
		const queueEmbed = new Pagination.FieldsEmbed()
			.setArray(queueClone)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(10)
			.formatField('# - Song', function (e) {
				return `**${queueClone.indexOf(e) + 1}**: ${e.title}`;
			});

		queueEmbed.embed
			.setColor('#dbc300')
			.setTitle(':twisted_rightwards_arrows: New Music Queue!');
		queueEmbed.build();
		await updateQueue(message, client)
	}
}