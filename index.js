const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();
const { MongoClient } = require('mongodb');
var read = require('fs-readdir-recursive');
const { leveling } = require('./function');
let cmds = new Discord.Collection();
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
		guild.games = []
	});
	try {
		client.pool = await MongoClient.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true }).catch((err) => {
        console.log(err)
    });
		console.log("Connected to the database.")
		client.guilds.cache.forEach(async (guild) => {
			if (!client.pool) return;
			client.pool.connect(err => {
				let result = client.pool.db("Tubb").collection("servers").find({ id: guild.id }).toArray();
				if (err) console.log(err);
				if (result.length == 0) {
					client.pool.db("Tubb").collection("servers").insertOne({ id: guild.id, prefix: "-", leveling: 1, queue: null })
				}
			});
		});
	} catch (err) {
		client.pool = null
		console.log('Unable to connect to the database: ' + err);
	}
		setInterval(() => {
			client.user.setActivity(`-help in ${client.guilds.cache.size} Servers`, { type: 'WATCHING' })
		}, 60000);
		console.log('Done!')
		let cmddirs = read('./cmds');
		let commands = []
		cmddirs.forEach(e => {
			let cmd = e.replace(`\\`, '/')
			let cmdpath = require(`./cmds/${cmd}`)
			cmds.set(cmdpath.name, cmdpath);
		});
});
client.on('message', async (message) => {
	if (message.channel.type == "dm") return;
	if (message.author.bot) return;
	let prefix = process.env.PREFIX;
	if (client.pool) {
		const result = await client.pool.db("Tubb").collection("servers").find({ id: message.guild.id }).toArray()
		prefix = result[0].prefix
		if (result[0].leveling == 1) {
			try {
				await leveling(message, client)
			} catch (err) { console.log(err) }
		}
	}
	if (message.mentions.has(client.user) && !message.content.includes(`@everyone`) && message.type != 'REPLY' && !message.content.includes("@here")) message.channel.send(`Well... this is awkward... your server's prefix is \`${prefix}\`...`)
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
		if (command.permission) {
			let perms = []
			command.permission.forEach(permission => {
				if (!message.guild.me.permissions.has(permission)) {
					perms.push(permission)
				}
			});
			if (perms.length >= 1) return message.reply(`I need the permission(s) \`${perms.join(', ')}\``)
		}
		if (command.ownerOnly == true && message.author.id !== process.env.OWNER) return message.reply("you cant do that!")
		if (command.NSFW == true && message.channel.nsfw !== true) return message.reply(`move it to an NSFW channel.`)
		const args = content.splice(1).join(" ");
		command.execute(message, args, client)
	}
})

client.on('guildCreate', async (guild) => {
	if (client.pool) {
		client.pool.db("Tubb").collection("servers").insertOne({ id: guild.id, prefix: "-", leveling: 1, queue: null })
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
			voiceChannel: null
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
				value: `Run -help to show all of my commands!`,
				inline: true,
			},
			{
				name: `Link to invite me to your server`,
				value: `[Invite me!](https://discord.com/api/oauth2/authorize?client_id=750123677739122819&permissions=414569197296&scope=bot)`,
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
