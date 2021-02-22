const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
const { defaultEmbed, search } = require('../../function.js')
let utility = []
let music = []
let embed;
module.exports = {
    name: 'help',
    group: 'utility',
    usage: `help (group or command)`,
    description: `Lists Tubb's commands!`,
    async execute(message, args, client) {
        const prefix = await client.pool.query(`SELECT * FROM prefixes WHERE guild = ${message.guild.id}`)
        if (!args) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Please Specify`)
                .setColor('#dbc300')
                .addFields([
                    {
                        name: 'Music Commands', value: `${prefix[0][0].prefix}help Music`
                    },
                    {
                        name: 'Utility Commands', value: `${prefix[0][0].prefix}help Utility`
                    },
                    {
                        name: 'Information on a Command', value: `${prefix[0][0].prefix}help [command]`
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
            }
        });
        let total = music.concat(utility)
        if (args == 'Music') {
            try {
                defaultEmbed(message, music, 'Music', client)
            } catch (err) {
                defaultEmbed(message, music, 'Music', client)
            }
        } else if (args == 'Utility') {
            try {
                defaultEmbed(message, utility, 'Utility', client)
            } catch (err) {
                defaultEmbed(message, utility, 'Utility', client)
            }
        } else {
            const prefix = await client.pool.query(`SELECT * FROM prefixes WHERE guild = ${message.guild.id};`)
            arg = args.toLowerCase()
            const cmd = search(arg, total)
            if (cmd) {
                embed = new Discord.MessageEmbed()
                    .setTitle(cmd.name)
                    .setDescription(cmd.description)
                    .addFields([
                        {
                            name: 'Usage', value: `${prefix[0][0].prefix}${cmd.usage}`
                        },
                        {
                            name: 'Aliases', value: `${cmd.aliases}`
                        }
                    ])
            } else return message.reply('that is not a valid command name.')
            return message.channel.send(embed)
        }
    }
}