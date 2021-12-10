const Discord = require('discord.js');
const { dependencies, version, engines } = require('../../package.json')
const si = require('systeminformation');
const moment = require('moment');
require('moment-duration-format');
var read = require('fs-readdir-recursive')
module.exports = {
	name: 'sysinfo',
	group: 'utility',
	usage: `sysinfo`,
	aliases: ['info'],
	description: `Get's info about me!.`,
	async execute(message, args, client) {
		const commands = read('./cmds')
		const embed = new Discord.MessageEmbed()
			.setTitle(`Tubb v${version}`)
			.setColor('#f0c018')
			.addField(`Node.js`, `\`${engines.node}\``, true)
			.addField(`Discord.js`, `\`${dependencies['discord.js']}\``, true)
			.addField(`Creator`, `\`L061571C5#5281\``, true)
			.addField(`Commands`, `\`${commands.length}\``, true)
			.addField('Memory Usage', `\`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\``, true)
			.addField('Uptime', `\`${moment.duration(client.uptime).format('d:hh:mm:ss')}\``, true)
			.addField(`Server`, `[Link](https://discord.com/invite/MZnHS95jx4)`, true)
			.addField(`Github`, `[Repo](https://github.com/L061571C5/TubbBot)`, true)
			.addField(`My Invite`, `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=414569197248&scope=bot)`, true)
		message.channel.send(embed)
	}
}