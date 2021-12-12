const { getQueues, updateQueues } = require("../../function.js")
const Pagination = require('discord-paginationembed');
module.exports = {
	name: 'removequeue',
	group: 'music',
	usage: 'removequeue (position of queue)',
	description: 'Deletes a saved queue!',
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
			queues.splice(args - 1, 1);
			await updateQueues(message, client, queues)
			message.reply(`:wastebasket: Remove queue number ${args}!`);
		} catch (err) {
			message.channel.send(`There was an error removing the queue, \`\`\`${err}\`\`\``)
		}
	}
}