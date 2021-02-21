const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
var fs = require('fs');
var read = require('fs-readdir-recursive')
let music = []
let utility = []
module.exports = {
    name: 'help',
    description: `Lists all of Tubb's commands!`,
    async execute(message, args) {
        if (!args) {
            let cmdarr = read('./cmds')
            cmdarr.forEach(cmd => {
                cmd.replace('\\\\', ' ')
            });
            console.log(cmdarr, '\\\\')
        } else if (args) {

        }
    }
}