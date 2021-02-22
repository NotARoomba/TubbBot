const Discord = require('discord.js');
const client = new Discord.Client();
const { Player } = require("discord-player");
const player = new Player(client, {
    leaveOnEndCooldown: 90000,
    leaveOnEnd: true,
    enableLive: true,
});
client.player = player;
require('dotenv').config();
const mysql = require("mysql2");
var pool = mysql.createPool({
    connectTimeout: 60 * 60 * 1000,
    //acquireTimeout: 60 * 60 * 1000,
    //timeout: 60 * 60 * 1000,
    connectionLimit: 1000,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    supportBigNumbers: true,
    charset: "utf8mb4",
    waitForConnections: true,
    queueLimit: 0
}).promise();
var read = require('fs-readdir-recursive')
let cmdarr = new Discord.Collection()
let aliasesarr = new Discord.Collection()
client.pool = pool
client.on('ready', async () => {
    const test = await pool.query(`SELECT * FROM prefixes WHERE guild = 783489298246139965;`)
    if (!test) {
        throw console.error('Unable to connect to the database:', err);
    }
    console.log('Connection has been established successfully.');
    setInterval(() => {
        client.user.setActivity(`-help in ${client.guilds.cache.size} Servers`, { type: 'WATCHING' })
    }, 60000);
    console.log('Done!')
    let cmddirs = read('./cmds');
    cmddirs.forEach(e => {
        let cmd = e.replace(`\\`, '/')
        let cmdpath = require(`./cmds/${cmd}`)
        if (cmdpath.aliases !== undefined) {
            for (const alias of cmdpath.aliases) {
                aliasesarr.set(alias, `./cmds/${cmd}`)
            }
        }
        cmdarr.set(cmdpath.name, `./cmds/${cmd}`);
    });
});
client.on('message', async (message) => {
    if (message.author.bot) return;
    const guildPrefix = await pool.query(`SELECT * FROM prefixes WHERE guild = ${message.guild.id};`)
    let prefix = guildPrefix[0][0].prefix
    if (message.content.startsWith(prefix)) {
        let content = message.content.slice(prefix.length).split(" ");
        if (cmdarr.get(content[0]) || aliasesarr.get(content[0])) {
            const { execute } = require(`${cmdarr.get(content[0]) || aliasesarr.get(content[0])}`)
            const args = content.splice(1).join(" ");
            execute(message, args, client)
        }
    }
    return
})

client.on('guildCreate', async (guild) => {
    await pool.query(`INSERT INTO prefixes(guild, prefix) VALUES ('${guild.id}','!')`)
    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    const invite = {
        title: `Thank you for inviting me to \`\`${guild.name}\`\`!`,
        fields: [
            {
                name: `My default prefix is`,
                value: `\`\`-\`\` but you can always change it by running \n-prefix`,
                inline: true,
            },
            {
                name: `My commands`,
                value: `Run -help or -commands to show all of my commands!`,
                inline: true,
            },
            {
                name: `Link to invite me to your server`,
                value: `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D%5B750123677739122819%5D%26scope%3Dbot&scope=bot)`, // This is optional if you want over people to invite your bot to different servers!
                inline: true,
            },
            {
                name: `My server if you have any questions`,
                value: `[Link](https://discord.com/invite/MZnHS95jx4)`, // This is optional if you want over people to invite your bot to different servers!
                inline: true,
            },
            {
                name: `My Website`,
                value: `[Link](https://tubb-bot.000webhostapp.com/)`, // This is optional if you want over people to invite your bot to different servers!
                inline: true,
            },
        ],
        timestamp: new Date(),
        footer: {
            text: `Thank you from the creator of ${client.user.username}`
        }
    }
    channel.send({ embed: invite })
})
client.player.on('trackStart', (message, track) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#FFED00')
        .setTitle(`:notes: Now Playing: ${track.title}`)
        .addField(':stopwatch: Duration:', track.duration)
        .setThumbnail(track.thumbnail)
        .setURL(track.url)
        .setFooter(`Requested by ${track.requestedBy.username}#${track.requestedBy.discriminator}!`, `https://cdn.discordapp.com/avatars/${track.requestedBy.id}/${track.requestedBy.avatar}.png`)
    message.channel.send(embed)
})
client.player.on('noResults', (message, query) => {
    message.reply(`I couldn't find any results for \`${query}\``)
})
client.player.on('trackAdd', (message, queue, track) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#FFED00')
        .setTitle(`:musical_note: ${track.title}`)
        .addField(
            `Has been added to queue. `,
            `This song is #${queue.tracks.length} in queue`
        )
        .setThumbnail(track.thumbnail)
        .setURL(track.url)
    message.channel.send(embed)
})
client.player.on('channelEmpty', (message) => {
    message.channel.send(`:zzz: Left channel due to inactivity.`)
})
client.player.on('botDisconnect', (message) => {
    message.channel.send(`:zzz: Left channel due to inactivity.`)
})
client.player.on('error', (err, message) => {
    err == 'NotPlaying' ? message.reply(`there nothing playing.`) : err == 'UnableToJoin' ? message.reply(`I couldn't joine the voice channel, check my permissions.`) : err == 'VideoUnavailable' ? message.reply(`the video you are trying to play is unavailable.`) : err == 'NotConnected' ? message.reply(`I am not connected to a voice channel, check my permissions.`) : message.reply(`An error occured`);
})

client.login(process.env.TOKEN);