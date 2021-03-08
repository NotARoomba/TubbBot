const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
const { searchArray, defaultEmbed } = require('../../function.js')
let utility = []
let music = []
let chess = []
let nsfw = []
module.exports = {
    name: 'help',
    group: 'utility',
    usage: `help (group or command)`,
    description: `Lists Tubb's commands!`,
    async execute(message, args, client) {
        const [prefix] = await client.pool.query(`SELECT prefix FROM servers WHERE id = ${message.guild.id}`)
        if (!args) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Please Specify`)
                .setColor('#dbc300')
                .addFields([
                    {
                        name: 'Music Commands', value: `${prefix[0].prefix}help Music`
                    },
                    {
                        name: 'Utility Commands', value: `${prefix[0].prefix}help Utility`
                    },
                    {
                        name: 'Chess Commands', value: `${prefix[0].prefix}help Chess`
                    },
                    message.channel.nsfw ?
                        {
                            name: 'NSFW Commands (requires an NSFW channel)', value: `${prefix[0].prefix}help NSFW`
                        } :
                        {
                            name: 'Information on a Command', value: `${prefix[0].prefix}help [command]`
                        },
                ])
            return message.channel.send(embed)
        }
        let cmdarr = read('./cmds')
        cmdarr.forEach(e => {
            let cmd = e.replace(`\\`, '/')
            let cmdpath = require(`../${cmd}`)
            if (cmdpath.group == 'music') {
                music.push({ name: cmdpath.name, description: cmdpath.description, aliases: cmdpath.aliases, usage: cmdpath.usage })
            } else if (cmdpath.group == 'utility') {
                utility.push({ name: cmdpath.name, description: cmdpath.description, aliases: cmdpath.aliases, usage: cmdpath.usage })
            } else if (cmdpath.group == 'chess') {
                chess.push({ name: cmdpath.name, description: cmdpath.description, aliases: cmdpath.aliases, usage: cmdpath.usage })
            } else if (cmdpath.group == 'NSFW') {
                nsfw.push({ name: cmdpath.name, description: cmdpath.description, aliases: cmdpath.aliases, usage: cmdpath.usage, NSFW: cmdpath.NSFW })
            }
        });
        let total = music.concat(utility, chess, nsfw)
        if (args == 'Music') {
            defaultEmbed(message, music, 'Music', client)
            music = []
        } else if (args == 'Utility') {
            defaultEmbed(message, utility, 'Utility', client)
            utility = []
        } else if (args == 'Chess') {
            defaultEmbed(message, chess, 'Chess', client)
            chess = []
        } else if (args == 'NSFW') {
            if (message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
            defaultEmbed(message, nsfw, 'NSFW', client)
            nsfw = []
        }
        else {
            args = args.toLowerCase()
            const cmd = searchArray(args, total)
            if (cmd) {
                if (cmd.NSFW == true && message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
                var embed = new Discord.MessageEmbed()
                    .setTitle(cmd.name)
                    .setDescription(cmd.description)
                    .addFields([
                        {
                            name: 'Usage', value: `${prefix[0].prefix}${cmd.usage}`
                        },
                        {
                            name: 'Aliases', value: `${cmd.aliases}`
                        },
                        {
                            name: 'NSFW', value: `${cmd.NSFW == true ? true : false}`
                        }
                    ])
            } else return message.reply('that is not a valid command name.')
            return message.channel.send(embed)
        }
    }
}