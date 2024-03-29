const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
require('dotenv').config();
const { searchForCommand, defaultEmbed, getGroups, getPrefix } = require('../../function.js')
module.exports = {
	name: 'help',
	group: 'utility',
	usage: `help (group or command)`,
	permission: ['MANAGE_MESSAGES'],
	description: `Lists Tubb's commands!`,
	async execute(message, args, client) {
		const commands = []
		let cmdarr = read('./cmds')
		cmdarr.forEach(e => {
			let cmd = e.replace(`\\`, '/')
			let cmdpath = require(`../${cmd}`)
			commands.push(cmdpath)
		});
		let prefix = await getPrefix(client, message)
		const groups = getGroups(commands)
		if (!args) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`Please Specify`)
				.setColor('#dbc300')
			for (i = 0; i < groups.length; i++) {
				if (groups[i] == "NSFW" && message.channel.nsfw !== true) continue
				embed.addField(`${groups[i][0].toUpperCase() + groups[i].slice(1)} Commands`, `\`\`\`${prefix}help ${groups[i]}\`\`\``, true)
			}
			embed.addField('Information on a Command', `${prefix}help [command]`, true)
			return message.channel.send(embed)
		} else {
			for (i = 0; i < groups.length; i++) {
				if (args.toLowerCase() == groups[i].toLowerCase()) {
					if (groups[i] == "NSFW" && message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
					return defaultEmbed(message, commands, groups[i][0].toUpperCase() + groups[i].slice(1), client, groups[i])
				}
			}
			args = args.toLowerCase()
			const cmd = searchForCommand(args, commands)
			if (cmd) {
			if (cmd.NSFW == true && message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
				var embed = new Discord.MessageEmbed()
					.setTitle(cmd.name)
					.setDescription(cmd.description)
					.setColor('#dbc300')
					.addField('Usage', `\`\`\`${prefix}${cmd.usage}\`\`\``, true)
					.addField('Aliases', `${cmd.aliases ? cmd.aliases.join(", ") : "None"}`, true)
				message.channel.send(embed)
			} else return message.reply('that is not a valid command name.')
		}
	}
}