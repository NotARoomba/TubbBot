const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
const Pagination = require('discord-paginationembed');
let utility = []
let music = []
module.exports = {
    name: 'help',
    group: 'utility',
    description: `Lists Tubb's commands!`,
    async execute(message, arg, client) {
        const prefix = await client.pool.query(`SELECT * FROM prefixes WHERE guild = ${message.guild.id}`)
        if (!arg) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Please Specify`)
                .setColor('#dbc300')
                .addFields([
                    {
                        name: 'Music Commands', value: `${prefix[0][0].prefix}help music`
                    },
                    {
                        name: 'Utility Commands', value: `${prefix[0][0].prefix}help utility`
                    }
                ])
            message.channel.send(embed)
        }
        args = arg.toLowerCase()
        let cmdarr = read('./cmds')
        cmdarr.forEach(e => {
            let cmd = e.replace(`\\`, '/')
            let cmdpath = require(`../${cmd}`)
            if (cmdpath.group == 'music') {
                music.push({ name: cmdpath.name, description: cmdpath.description })
            } else if (cmdpath.group == 'utility') {
                utility.push({ name: cmdpath.name, description: cmdpath.description })
            }
        });
        if (args == 'music') {
            try {
                module.exports.defaultEmbed(message, music, 'Music', client)
            } catch (err) {
                module.exports.defaultEmbed(message, music, 'Music', client)
            }
        } else if (args == 'utility') {
            try {
                module.exports.defaultEmbed(message, utility, 'Utility', client)
            } catch (err) {
                module.exports.defaultEmbed(message, utility, 'Utility', client)
            }
        }


    },
    defaultEmbed(message, array, name, client) {
        const embed = new Pagination.FieldsEmbed()
            .setArray(array)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField('Name - Description', function (e) {
                return `**${e.name}**:  ${e.description}`;
            })
            .setPage(1)
            .setPageIndicator('footer')
        embed.embed.setColor('#dbc300').setTitle(`${name} Commands`).setFooter('', `${client.user.avatarURL('webp', 16)}`);;
        return embed.build();
    }
}