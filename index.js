const Discord = require('discord.js')
const client = new Discord.Client();
require('dotenv').config();
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path')
var read = require('fs-readdir-recursive')

client.on('ready', () => {
    console.log('Tubb is starting!')
    setInterval(() => {
        client.user.setActivity(`-help in ${client.guilds.cache.size} Servers`, { type: 'WATCHING' })
    }, 60000);
    console.log('Done!')
    let cmdarr = []
    const files = read('./cmds/');
    files.forEach(file => {
        let cmd = file.replace('.js', '');
        let props = require(`./cmds/${cmd}`);
        cmdsplit = cmd.split('\\\\').pop
        cmdarr.push(cmdsplit)
    });
    console.log(cmdarr)
});


client.login(process.env.TOKEN);