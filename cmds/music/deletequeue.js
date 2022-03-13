const { getQueues, updateQueues } = require("../../function.js")
const Pagination = require('discord-paginationembed');
module.exports = {
	name: 'deletequeue',
	group: 'music',
	usage: 'deletequeue (position of queue)',
	aliases: ['dq'],
	permission: ['MANAGE_MESSAGES'],
	description: 'Deletes a saved queue!',
	async execute(message, args, client) {
		try {
			let queues = await getQueues(message, client)
      let queuesClone = queues
			if (queues.length == 0) return message.reply("you have no saved queues!")
			if (isNaN(Number(args))) return message.reply(`that is not a number.`)
			const queueEmbed = new Pagination.FieldsEmbed()
				.setArray(queuesClone)
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setElementsPerPage(10)
				.formatField('# - Song', function (e) {
					return `**${queuesClone.indexOf(e) + 1}**:  ${e[0][0]}`;
				});
			queueEmbed.embed.setColor('#dbc300').setTitle('Saved Queues');
			if (args == 0 || args > queues.length || args.includes('.')) {
			  queueEmbed.build();
        return message.reply(`that is not a valid queue position.`);
      }
			queues.splice(args - 1, 1);
			await updateQueues(message, client, queues)
			message.reply(`:wastebasket: Removed \`${queuesClone[args - 1][0][0]}\` from your saved queues!`);
		} catch (err) {
			message.channel.send(`There was an error removing the queue, \`\`\`${err}\`\`\``)
		}
	}
}