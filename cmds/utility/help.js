const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
var read = require('fs-readdir-recursive')
module.exports = {
    name: 'help',
    description: `Lists all of Tubb's commands!`,
    async execute(message, args) {
        if (!args) {
            let cmdarr = read('./cmds')
            cmdarr.forEach(e => {
                let cmd = e.replace(`\\`, '/')
                console.log(require(`../${cmd}`))
            });
        } else if (args) {

        }
    }
}