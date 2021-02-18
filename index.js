const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`)
var fs = require('fs');
const prefix = '!'
let cmdarr = new Map()
let aliasesarr = new Map()
Discord.Structures.extend('Guild', function (Guild) {
    class MusicGuild extends Guild {
    }
    this.musicData = {
        queue: [],
        isPlaying: false,
        dispatcher: null,
        nowPlaying: null,
        volume: 1,
        loopSong: false,
        loopQueue: false
    }
    return MusicGuild;
})
client.on('ready', async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
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
            //console.log(cmdpath.aliases)
            if (cmdpath.aliases !== undefined) {
                for (const alias of cmdpath.aliases) {
                    aliasesarr.set(alias, `./cmds/${folder}/${cmd}.js`)
                }
            }
            cmdarr.set(cmd, `./cmds/${folder}/${cmd}.js`)
            //console.log(cmdarr)
            //console.log(aliasesarr)

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