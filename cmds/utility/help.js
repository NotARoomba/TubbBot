const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
require('dotenv').config();
const { searchForCommand, defaultEmbed } = require('../../function.js')
const commands = []
module.exports = {
	name: 'help',
	group: 'utility',
	usage: `help (group or command)`,
	description: `Lists Tubb's commands!`,
	async execute(message, args, client) {
		const [prefix] = [{prefix: precess.env.PREFIX}]
		if (pool) {
			const [prefix] = await client.pool.query(`SELECT prefix FROM servers WHERE id = ${message.guild.id}`)
		}
		if (!args) {
				const embed = new Discord.MessageEmbed()
						.setTitle(`Please Specify`)
						.setColor('#dbc300')
						.addField('Music Commands', `${prefix[0].prefix}help Music`, true)
						.addField('Utility Commands', `${prefix[0].prefix}help Utility`, true)
						.addField('Chess Commands', `${prefix[0].prefix}help Chess`, true)
				message.channel.nsfw ?
						embed.addField('NSFW Commands (requires an NSFW channel)', `${prefix[0].prefix}help NSFW`, true)
								.addField('Information on a Command', `${prefix[0].prefix}help [command]`, true)
						: embed.addField('Information on a Command', `${prefix[0].prefix}help [command]`, true)
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
			case 'NSFW':
					if (message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
					defaultEmbed(message, commands, 'NSFW', client, 'NSFW')
					break;

			default:
					args = args.toLowerCase()
					const cmd = searchForCommand(args, commands)
					if (cmd) {
							if (cmd.NSFW == true && message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
							var embed = new Discord.MessageEmbed()
									.setTitle(cmd.name)
									.setDescription(cmd.description)
									.setColor('#dbc300')
									.addField('Usage', `${prefix[0].prefix}${cmd.usage}`, true)
									.addField('Aliases', `${cmd.aliases}`, true)
									.addField('NSFW', `${cmd.NSFW == true ? true : false}`, true)
							message.channel.send(embed)
					} else return message.reply('that is not a valid command name.')
			break;
		}
	}
}