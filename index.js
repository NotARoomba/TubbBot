const Discord = require('discord.js')
const client = new Discord.Client();
require('dotenv').config();
var fs = require('fs');
const prefix = '!'
let cmdarr = new Map()
let aliasesarr = new Map()
client.on('ready', () => {
    console.log('Tubb is starting!')
    setInterval(() => {
        client.user.setActivity(`-help in ${client.guilds.cache.size} Servers`, { type: 'WATCHING' })
    }, 60000);
    console.log('Done!')
    var files = fs.readdirSync('./cmds');
    //console.log(files)
    files.forEach(folder => {
        var categories = fs.readdirSync(`./cmds/${folder}`);
        categories.forEach(cmds => {
            cmd = cmds.replace('.js', '')
            cmdpath = require(`./cmds/${folder}/${cmd}.js`)
            let aliases = cmdpath.aliases
            cmdarr.set(cmd, `./cmds/${folder}/${cmd}.js`)
            //console.log(cmdarr)
            aliasesarr.set(aliases, `./cmds/${folder}/${cmd}.js`)

        });
    });
    //console.log(cmdarr)
});
client.on('message', message => {
    if (message.content.charAt(0) === prefix) {
        let content = message.content.slice(prefix.length).toLowerCase().split(" ");
        if (cmdarr.get(content[0]) || aliasesarr.get(content[0])) {
            const { execute } = require(`${cmdarr.get(content[0]) || aliasesarr.get(content[0])}`)
            const args = content.splice(1).join(" ");
            execute(message, args)
        }
        return
    }

})


client.login(process.env.TOKEN);