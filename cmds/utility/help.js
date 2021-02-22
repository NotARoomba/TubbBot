const Discord = require('discord.js');
var read = require('fs-readdir-recursive')
const Pagination = require('discord-paginationembed');
let cmdname = []
let cmddesc = []
module.exports = {
    name: 'help',
    description: `Lists all of Tubb's commands!`,
    async execute(message, args) {
        if (!args) {
            let cmdarr = read('./cmds')
            cmdarr.forEach(e => {
                let cmd = e.replace(`\\`, '/')
                let cmdpath = require(`../${cmd}`)
                for (const desc of cmdpath.description) {
                    cmddesc.push(desc)
                }
                for (const name of cmdpath.name) {
                    cmdname.push(name)
                }

            });
        } else if (args) {

        }
    }
}