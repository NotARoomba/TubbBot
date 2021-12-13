const { getQueues } = require("../../function.js");
const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
module.exports = {
	name: 'listqueue',
	group: 'music',
	usage: 'listqueues',
	aliases: ['list'],
	permission: ['MANAGE_MESSAGES'],
	description: 'Gets your saved song queues!',
	async execute(message, args, client) {
		try {
			let queues = await getQueues(message, client)
			if (queues.length == 0) return message.reply("you have no saved queues!")
			let embeds = []
			for (i = 0; i < queues.length; i++) {
				description = ""
				for (a = 0; a < queues[i][1].length; a++) {
					description = description + `**${a + 1}**: ${queues[i][1][a].title}\n`
				}
				const embed = new Discord.MessageEmbed()
					.setColor('#FFED00')
					.setTitle(`Queue: ${queues[i][0][0]}`)
					.setDescription(description)
					.setFooter(`${message.author.username}#${message.author.tag}'s queue'`, message.author.displayAvatarURL());
				embeds.push(embed)
			}
			const embed = new Pagination.Embeds()
				.setArray(embeds)
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
			await embed.build()
		} catch (err) {
			console.log(err)
			message.channel.send(`There was an error getting the queue, \`\`\`${err}\`\`\``)
		}
	}
}