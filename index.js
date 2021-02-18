const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`, {
    logging: false
})
var fs = require('fs');
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
    client.guilds.cache.forEach(async (guild) => {
        const Prefix = sequelize.define('prefix', {
            guild: Sequelize.STRING,
            prefix: Sequelize.STRING
        })
        Prefix.sync();
        const prefix = await Prefix.findOne({ where: { guild: guild.id } });
        if (prefix == null || undefined) {
            await Prefix.create({
                guild: guild.id,
                prefix: process.env.PREFIX,
            });
        }
    });
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
client.on('message', async (message) => {
    if (message.author.bot) return;
    const Prefix = sequelize.define('prefix', {
        guild: Sequelize.STRING,
        prefix: Sequelize.STRING
    })
    const guildPrefix = await Prefix.findOne({ where: { guild: message.guild.id } });
    let prefix = guildPrefix.prefix
    if (message.content.startsWith(prefix)) {
        let content = message.content.slice(prefix.length).toLowerCase().split(" ");
        if (cmdarr.get(content[0]) || aliasesarr.get(content[0])) {
            const { execute } = require(`${cmdarr.get(content[0]) || aliasesarr.get(content[0])}`)
            const args = content.splice(1).join(" ");
            execute(message, args)
        }
    }
    return
})

client.login(process.env.TOKEN);