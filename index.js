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
        let content = message.content.split(" ");
        content[0].toString().substring(1);
        console.log(content[0])
        if (cmdarr.get(content[0]) || aliasesarr.get(content[0])) {
            //console.log(cmdarr.get(content))
            const { execute } = require(`${cmdarr.get(content[0]) || aliasesarr.get(content[0])}`)
            //content.shift();
            execute(message, content)
        }
        return
    }

})


client.login(process.env.TOKEN);