const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
//TODO: ADD MYSQL
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
var read = require('fs-readdir-recursive');
const { leveling } = require('./function');
let cmds = new Discord.Collection()
client.pool = pool
client.on('ready', async () => {
    client.guilds.cache.forEach(guild => {
        guild.musicData = {
            queue: [],
            previous: [],
            filters: [],
            volume: 1,
            isPlaying: false,
            nowPlaying: null,
            loopSong: false,
            loopQueue: false,
            songDispatcher: null,
            connection: null,
            voiceChannel: null,
        }
    });
    try {
        await pool.query(`SELECT * FROM servers`)
        console.log('Connection has been established successfully.');
    } catch (err) {
			client.pool = null
			pool = null
      console.log('Unable to connect to the database:');
    }
    client.guilds.cache.forEach(async (guild) => {
				if (!pool) return;
        const [prefix] = await pool.query(`SELECT * FROM servers WHERE id = ${guild.id};`)
        if (prefix[0].prefix == undefined) {
            await pool.query(`INSERT INTO servers (id, prefix) VALUES ('${guild.id}','-')`)
        }
    });
    setInterval(() => {
        client.user.setActivity(`-help in ${client.guilds.cache.size} Servers`, { type: 'WATCHING' })
    }, 60000);
    console.log('Done!')
    let cmddirs = read('./cmds');
    cmddirs.forEach(e => {
        let cmd = e.replace(`\\`, '/')
        let cmdpath = require(`./cmds/${cmd}`)
        cmds.set(cmdpath.name, cmdpath);
    });
});
client.on('message', async (message) => {
    if (message.author.bot) return;
		prefix = process.env.PREFIX
		if (pool) {
			const [value] = await pool.query(`SELECT leveling FROM servers WHERE id = ${message.guild.id};`)
			if (value[0].leveling == 1) {
					try {
							await leveling(message, client)
					} catch (err) { }
			}
			const [guildPrefix] = await pool.query(`SELECT * FROM servers WHERE id = ${message.guild.id};`)
			let prefix = process.env.PREFIX
			try {
					prefix = guildPrefix[0].prefix
			} catch (err) {
					prefix = process.env.PREFIX
			}
		}
    if (message.mentions.has(client.user) && !message.content.includes(`@everyone`)) message.reply(`Well... this is awkward... your server's prefix is \`${prefix}\`...`)
    if (message.content.startsWith(prefix)) {
        let content = message.content.slice(prefix.length).split(" ");
        const command = cmds.get(content[0]) || cmds.find(cmd => cmd.aliases && cmd.aliases.includes(content[0]));
        if (!command) return;
        if (command.permissions) {
            let perms = []
            command.permissions.forEach(permission => {
                if (!message.member.hasPermission(permission)) {
                    perms.push(permission)
                }
            });
            if (perms.length >= 1) return message.reply(`You need the permission(s) \`${perms.join(', ')}\``)
        }
        if (command.ownerOnly == true && message.author.id !== process.env.OWNER) return message.reply("you cant do that!")
        if (command.NSFW == true && message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
        const args = content.splice(1).join(" ");
        command.execute(message, args, client)
    }
})

client.on('guildCreate', async (guild) => {
		if (pool) {
			await pool.query(`INSERT INTO servers (id, prefix) VALUES ('${guild.id}','-')`)
			guild.musicData = {
					queue: [],
					previous: [],
					filters: [],
					volume: 1,
					isPlaying: false,
					nowPlaying: null,
					loopSong: false,
					loopQueue: false,
					songDispatcher: null,
					connection: null,
					voiceChannel: null,
			}
		}
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
                value: `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D%5B750123677739122819%5D%26scope%3Dbot&scope=bot)`, 
                inline: true,
            },
            {
                name: `My server if you have any questions`,
                value: `[Link](https://discord.com/invite/MZnHS95jx4)`, 
                inline: true,
            },
            {
                name: `My Code`,
                value: `[Link](https://github.com/NotARoomba/TubbBot/)`,
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
client.on('voiceStateUpdate', async (___, newState) => {
    if (newState.member.user.bot && !newState.channelID && newState.guild.musicData.songDispatcher && newState.member.user.id == client.user.id) {
        newState.guild.musicData.queue.length = 0;
        newState.guild.musicData.songDispatcher.end();
        return;
    }
    if (newState.member.user.bot && newState.channelID && newState.member.user.id == client.user.id && !newState.selfDeaf) {
        newState.setSelfDeaf(true);
    }
});

client.login(process.env.TOKEN);