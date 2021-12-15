const Pagination = require('discord-paginationembed');
const { isValidCommander, updateQueue } = require("../../function");
module.exports = {
	name: 'removeduplicates',
	group: 'music',
	usage: 'removeduplicates',
	aliases: ['rd', 'removedupes'],
	permission: ['MANAGE_MESSAGES'],
	description: 'Removes dupicate songs in the queue!',
	async execute(message, args, client) {
		if (isValidCommander(message) !== true) return
		let queue = message.guild.musicData.queue.filter((value, index, self) =>
			index === self.findIndex((t) => (
				t.title === value.title
			))
		)
		message.guild.musicData.queue = queue
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