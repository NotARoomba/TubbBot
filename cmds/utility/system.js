const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
const { defaultEmbed } = require('../../function.js')
const si = require('systeminformation');
module.exports = {
	name: 'system',
	group: 'utility',
	usage: `system`,
	permission: ['MANAGE_MESSAGES'],
	description: `Get's (very detailed) info about me!.`,
	async execute(message, args, client) {
		system = Object.entries(await si.system())
		module.exports.makeEmbed('System', system, message, client)
		cpu = Object.entries(await si.cpu())
		module.exports.makeEmbed('CPU', cpu, message, client)
		memory = Object.entries(await si.mem())
		module.exports.makeEmbed('Memory', memory, message, client)
		network = Object.entries(await si.networkInterfaces())
		for (var i = 0; i < network.length; i++) {
			module.exports.makeEmbed(`Network ${i}`, Object.entries(network[i][1]), message, client)
		}
	},
	makeEmbed(title, array, message, client) {
		const embed = new Pagination.FieldsEmbed()
			.setArray(array)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(10)
			.formatField('Item - Attribute', function (e) {
				return `**${e[0]}**:  ${e[1]}`;
			})
			.setPageIndicator('footer', (page, pages) => `Page ${page} of ${pages}`)
		embed.embed.setColor('#dbc300').setTitle(`${title} Info`).setFooter('', `${client.user.avatarURL('webp', 16)}`);
		embed.build();
	}
}