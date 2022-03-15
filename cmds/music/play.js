const { validYTURL, validSPURL, validGDURL, updateQueue, getQueue, validYTPlaylistURL, validSCURL, validURL, validMSURL, addYTURL, addYTPlaylist, addSPURL, addSCURL, addGDURL, addMSURL, addAttachment, addURL, search } = require("../../function.js");
const ytdl = require('discord-ytdl-core');
const scdl = require('soundcloud-downloader').default
const Discord = require('discord.js');
module.exports = {
	name: 'play',
	group: 'music',
	usage: 'play (song name or link)',
	aliases: ['p'],
	permission: ['CONNECT', 'SPEAK', 'USE_VAD', 'MANAGE_MESSAGES'],
	description: 'Plays music!',
	async execute(message, args, client) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply('please join a voice channel and try again!');
			return;
		}
		message.guild.musicData.voiceChannel = voiceChannel
		try {
			let result;
			let dbqueue = await getQueue(message, client)
			if (validYTPlaylistURL(args)) result = await addYTPlaylist(message, args, voiceChannel);
			else if (validYTURL(args)) result = await addYTURL(message, args, voiceChannel);
			else if (validSPURL(args)) result = await addSPURL(message, args, voiceChannel);
			else if (validSCURL(args)) result = await addSCURL(message, args, voiceChannel);
			else if (validGDURL(args)) result = await addGDURL(message, args, voiceChannel);
        else if (validMSURL(args)) result = await addMSURL(message, args, voiceChannel);
			else if (validURL(args)) result = await addURL(message, args, voiceChannel);
			else if (message.attachments.size > 0) result = await addAttachment(message, voiceChannel);
			else if (args !== "") result = await search(message, args, voiceChannel);
      else if (args == "" && dbqueue.length !== 0 && dbqueue !== 404) result = dbqueue;
      else return message.reply("Specify a song name of link.");
			result.forEach(track => {
				message.guild.musicData.queue.push(track)
			});
			try {
				if (dbqueue.length !== message.guild.musicData.queue.length && dbqueue.length + 1 !== message.guild.musicData.queue.length && dbqueue !== 404) {
					dbqueue.forEach(track => {
						message.guild.musicData.queue.push(track)
					});
				}
				await updateQueue(message, client)
			} catch { }
			const addembed = new Discord.MessageEmbed()
				.setColor(result[0].color)
				.setTitle(`:musical_note: ${result[0].title}`)
				.setDescription(`Has been added to the queue.\nThis track is #${message.guild.musicData.queue.length} in the queue`)
				.setThumbnail(result[0].thumbnail)
				.setURL(result[0].url)
			if (result.length > 1) addembed.setTitle(`:musical_note: ${result.length} tracks were added.`).setThumbnail(result[0].thumbnail).setDescription(`\nThe tracks are #${message.guild.musicData.queue.length} in the queue`);
			if (typeof message.guild.musicData.songDispatcher == 'undefined' || message.guild.musicData.songDispatcher == null) {
				module.exports.play(message, voiceChannel, client)
			} else message.channel.send(addembed)
		} catch (err) {
			console.log(err)
		}
	},
	async play(message, voiceChannel, client) {
		const npembed = new Discord.MessageEmbed()
			.setColor(message.guild.musicData.queue[0].color)
			.setTitle(`:notes: Now Playing: ${message.guild.musicData.queue[0].title}`)
			.addFields([
				{
					name: `:stopwatch: Duration:`,
					value: message.guild.musicData.queue[0].lengthFormatted
				}
			])
			.setThumbnail(message.guild.musicData.queue[0].thumbnail)
			.setURL(message.guild.musicData.queue[0].url)
			.setFooter(`Requested by ${message.guild.musicData.queue[0].memberDisplayName}!`, message.guild.musicData.queue[0].memberAvatar)
		if (message.guild.musicData.queue[0].isLive == true) npembed.fields = [], npembed.addFields([{ name: `:stopwatch: Duration:`, value: ':red_circle: Live Stream' }])
		let seek = 0
		message.guild.musicData.queue[0].seek !== 0 ? seek = message.guild.musicData.queue[0].seek : message.channel.send(npembed)
		const encoderArgsFilters = []
		message.guild.musicData.filters.forEach(filter => {
			if (filter[Object.keys(filter)[0]] !== '') {
				encoderArgsFilters.push(filter[Object.keys(filter)[0]])
			}
		});
		let encoderArgs
		if (encoderArgsFilters.length < 1) {
			encoderArgs = []
		} else {
			encoderArgs = ['-af', encoderArgsFilters.join(',')]
		}
		if (message.guild.musicData.queue[0].type == 0) {
			const stream = ytdl(message.guild.musicData.queue[0].url, {
				filter: "audioonly",
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
				requestOptions: {
					headers: {
						cookie: process.env.COOKIE,
					}
				}
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					message.guild.musicData.connection = connection
					 message.guild.musicData.songDispatcher = await message.guild.musicData.connection.play(stream, {
						type: 'opus',
						bitrate: "auto"
					})
					message.guild.musicData.isPlaying = true;
					message.guild.musicData.songDispatcher.setVolume(message.guild.musicData.volume);
					message.guild.musicData.nowPlaying = message.guild.musicData.queue[0];
					let ended = await message.guild.musicData.queue.shift()
					message.guild.musicData.previous.push(ended)
				  await updateQueue(message, client)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { console.log(err) }
		} else if (message.guild.musicData.queue[0].type == 1) {
			const data = await scdl.download(message.guild.musicData.queue[0].url)
			const stream = ytdl.arbitraryStream(data, {
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					message.guild.musicData.connection = connection
					message.guild.musicData.songDispatcher = await message.guild.musicData.connection.play(stream, {
						type: 'opus',
						bitrate: "auto"
					})
					message.guild.musicData.isPlaying = true;
					message.guild.musicData.songDispatcher.setVolume(message.guild.musicData.volume);
					message.guild.musicData.nowPlaying = message.guild.musicData.queue[0];
					let ended = await message.guild.musicData.queue.shift()
					message.guild.musicData.previous.push(ended)
				  await updateQueue(message, client)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { console.log(err) }
		} else if (message.guild.musicData.queue[0].type == 2) {
			const stream = ytdl.arbitraryStream(message.guild.musicData.queue[0].url, {
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					message.guild.musicData.connection = connection
					message.guild.musicData.songDispatcher = await message.guild.musicData.connection.play(stream, {
						type: 'opus',
						bitrate: "auto"
					})
					message.guild.musicData.isPlaying = true;
message.guild.musicData.songDispatcher.setVolume(message.guild.musicData.volume);
					message.guild.musicData.nowPlaying = message.guild.musicData.queue[0];
					let ended = await message.guild.musicData.queue.shift()
					message.guild.musicData.previous.push(ended)
				  await updateQueue(message, client)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { console.log(err) }
		}
	},
	musicHandler(message, voiceChannel, client) {
		message.guild.musicData.songDispatcher.on('finish', async () => {
			if (message.guild.musicData.loopSong) {
				if (message.guild.musicData.nowPlaying !== null) message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
				message.guild.musicData.nowPlaying.seek = 0
				await updateQueue(message, client)
			} else if (message.guild.musicData.loopQueue) {
				if (message.guild.musicData.nowPlaying !== null) message.guild.musicData.queue.push(message.guild.musicData.nowPlaying);
				await updateQueue(message, client)
			}
			if (message.guild.musicData.queue.length >= 1) {
				module.exports.play(message, voiceChannel, client);
				return;
			} else {
				message.guild.musicData.isPlaying = false;
				message.guild.musicData.nowPlaying = null;
				message.guild.musicData.songDispatcher = null;
				if (message.guild.me.voice.channel) {
					setTimeout(function onTimeOut() {
						if (message.guild.musicData.isPlaying == false && message.guild.me.voice.channel) {
							message.guild.me.voice.channel.leave();
							message.channel.send(':zzz: Left channel due to inactivity.');
						}
					}, 90000);
				}
			}
		})
    message.guild.musicData.connection.on('disconnect', async function (e) {
      try {
      if (message.guild.musicData.nowPlaying !== null) if (message.guild.musicData.nowPlaying !== null) message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
			await updateQueue(message, client)
			message.guild.musicData.isPlaying = false;
			message.guild.musicData.loopQueue = false
			message.guild.musicData.queue.length = 0
      message.guild.musicData.songDispatcher = undefined;
		} catch (err) {
			message.guild.musicData.isPlaying = false;
			message.guild.musicData.loopQueue = false;
			message.guild.musicData.queue.length = 0
       message.guild.musicData.songDispatcher = undefined;
		}
    })
		message.guild.musicData.songDispatcher.on('error', async function (e) {
			message.channel.send('Cannot play song!');
			if (message.guild.musicData.queue.length > 1) {
				let ended = await message.guild.musicData.queue.shift()
				message.guild.musicData.previous.push(ended)
				await updateQueue(message, client)
				module.exports.play(message, voiceChannel, client);
				return;
			}
			message.guild.musicData.queue.length = 0;
			message.guild.musicData.isPlaying = false;
			message.guild.musicData.nowPlaying = null;
			message.guild.musicData.loopSong = false;
			message.guild.musicData.songDispatcher = null;
			message.guild.me.voice.channel.leave();
			return;
		});
	}
}
