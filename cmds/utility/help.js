const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
require('dotenv').config();
const { searchForCommand, defaultEmbed } = require('../../function.js')
module.exports = {
	name: 'help',
	group: 'utility',
	usage: `help (group or command)`,
	description: `Lists Tubb's commands!`,
	async execute(message, args, client) {
		const commands = []
		let prefix = process.env.PREFIX
		if (client.pool != null) {
			let result = await client.pool.db("Tubb").collection("servers").find({id: message.guild.id}).toArray()
			prefix = result[0].prefix
		}
		if (!args) {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Please Specify`)
					.setColor('#dbc300')
					.addField('Music Commands', `${prefix}help Music`, true)
					.addField('Utility Commands', `${prefix}help Utility`, true)
					.addField('Chess Commands', `${prefix}help Chess`, true)
				embed.addField('Information on a Command', `${prefix}help [command]`, true)
				return message.channel.send(embed)
		}
		let cmdarr = read('./cmds')
		cmdarr.forEach(e => {
				let cmd = e.replace(`\\`, '/')
				let cmdpath = require(`../${cmd}`)
				commands.push(cmdpath)
		});
		switch (args) {
			case 'Music':
					defaultEmbed(message, commands, 'Music', client, 'music')
					break;
			case 'Chess':
					defaultEmbed(message, commands, 'Chess', client, 'chess')
					break;
			case 'Utility':
					defaultEmbed(message, commands, 'Utility', client, 'utility')
					break;

			default:
					args = args.toLowerCase()
					const cmd = searchForCommand(args, commands)
					if (cmd) {
							var embed = new Discord.MessageEmbed()
									.setTitle(cmd.name)
									.setDescription(cmd.description)
									.setColor('#dbc300')
									.addField('Usage', `${prefix}${cmd.usage}`, true)
									.addField('Aliases', `${cmd.aliases.join(", ")}`, true)
							message.channel.send(embed)
					} else return message.reply('that is not a valid command name.')
			break;
		}
	}
}