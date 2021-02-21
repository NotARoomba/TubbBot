const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
var fs = require('fs');
let cmdarr = []
let descarr = []
module.exports = {
    name: 'help',
    description: `Lists all of Tubb's commands!`,
    async execute(message, args) {
        if (!args) {
            var folders = fs.readdirSync('../../cmds');
            folders.forEach(folder => {
                var categories = fs.readdirSync(`../../cmds/${folder}`);
                categories.forEach(cmds => {
                    cmd = cmds.replace('.js', '')
                    cmdpath = require(`./cmds/${folder}/${cmd}.js`)
                    if (cmdpath.description !== undefined) {
                        for (const desc of cmdpath.description) {
                            descarr.push(desc)
                        }
                    }
                    if (cmdpath.name !== undefined) {
                        for (const name of cmdpath.name) {
                            cmdarr.push(name)
                        }
                    }
                });
            });
            const embed = new Pagination.FieldsEmbed()
                .setArray(cmdarr, descarr)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField('# - Song', function (e) {
                    `**${cmdarr[(e) + 1]}**:  ${e.title}`;
                });
        } else if (args) {

        }
    }
}