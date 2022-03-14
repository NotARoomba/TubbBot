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
		const musicData = message.guild.musicData
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply('please join a voice channel and try again!');
			return;
		}
		musicData.voiceChannel = voiceChannel
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
				musicData.queue.push(track)
			});
			try {
				if (dbqueue.length !== musicData.queue.length && dbqueue.length + 1 !== musicData.queue.length && dbqueue !== 404) {
					dbqueue.forEach(track => {
						musicData.queue.push(track)
					});
				}
				await updateQueue(message, client)
			} catch { }
			const addembed = new Discord.MessageEmbed()
				.setColor(result[0].color)
				.setTitle(`:musical_note: ${result[0].title}`)
				.setDescription(`Has been added to the queue.\nThis track is #${musicData.queue.length} in the queue`)
				.setThumbnail(result[0].thumbnail)
				.setURL(result[0].url)
			if (result.length > 1) addembed.setTitle(`:musical_note: ${result.length} tracks were added.`).setThumbnail(result[0].thumbnail).setDescription(`\nThe tracks are #${musicData.queue.length} in the queue`);
			if (typeof musicData.songDispatcher == 'undefined' || musicData.songDispatcher == null) {
				module.exports.play(message, voiceChannel, client)
			} else message.channel.send(addembed)
		} catch (err) {
			console.log(err)
		}
	},
	async play(message, voiceChannel, client) {
		const musicData = message.guild.musicData
		const npembed = new Discord.MessageEmbed()
			.setColor(musicData.queue[0].color)
			.setTitle(`:notes: Now Playing: ${musicData.queue[0].title}`)
			.addFields([
				{
					name: `:stopwatch: Duration:`,
					value: musicData.queue[0].lengthFormatted
				}
			])
			.setThumbnail(musicData.queue[0].thumbnail)
			.setURL(musicData.queue[0].url)
			.setFooter(`Requested by ${musicData.queue[0].memberDisplayName}!`, musicData.queue[0].memberAvatar)
		if (musicData.queue[0].isLive == true) npembed.fields = [], npembed.addFields([{ name: `:stopwatch: Duration:`, value: ':red_circle: Live Stream' }])
		let seek = 0
		musicData.queue[0].seek !== 0 ? seek = musicData.queue[0].seek : message.channel.send(npembed)
		const encoderArgsFilters = []
		musicData.filters.forEach(filter => {
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
		if (musicData.queue[0].type == 0) {
			const stream = ytdl(musicData.queue[0].url, {
				filter: "audioonly",
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					musicData.connection = connection
					const dispatcher = await connection.play(stream, {
						type: 'opus',
						bitrate: "auto"
					})
					musicData.isPlaying = true;
					musicData.songDispatcher = dispatcher
					dispatcher.setVolume(musicData.volume);
					musicData.nowPlaying = musicData.queue[0];
					let ended = await musicData.queue.shift()
					musicData.previous.push(ended)
				  await updateQueue(message, client)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { console.log(err) }
		} else if (musicData.queue[0].type == 1) {
			const data = await scdl.download(musicData.queue[0].url)
			const stream = ytdl.arbitraryStream(data, {
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					musicData.connection = connection
					const dispatcher = await connection.play(stream, {
						type: 'opus',
						bitrate: "auto"
					})
					musicData.isPlaying = true;
					musicData.songDispatcher = dispatcher
					dispatcher.setVolume(musicData.volume);
					musicData.nowPlaying = musicData.queue[0];
					let ended = await musicData.queue.shift()
					musicData.previous.push(ended)
				  await updateQueue(message, client)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { console.log(err) }
		} else if (musicData.queue[0].type == 2) {
			const stream = ytdl.arbitraryStream(musicData.queue[0].url, {
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					musicData.connection = connection
					const dispatcher = await connection.play(stream, {
						type: 'opus',
						bitrate: "auto"
					})
					musicData.isPlaying = true;
					musicData.songDispatcher = dispatcher
					dispatcher.setVolume(musicData.volume);
					musicData.nowPlaying = musicData.queue[0];
					let ended = await musicData.queue.shift()
					musicData.previous.push(ended)
				  await updateQueue(message, client)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { console.log(err) }
		}
	},
	musicHandler(message, voiceChannel, client) {
		const musicData = message.guild.musicData
		const dispatcher = musicData.songDispatcher
		dispatcher.on('finish', async () => {
			if (musicData.loopSong) {
				musicData.queue.unshift(musicData.nowPlaying);
				message.guild.musicData.nowPlaying.seek = 0
				await updateQueue(message, client)
			} else if (musicData.loopQueue) {
				musicData.queue.push(musicData.nowPlaying);
				await updateQueue(message, client)
			}
			if (musicData.queue.length >= 1) {
				module.exports.play(message, voiceChannel, client);
				return;
			} else {
				musicData.isPlaying = false;
				musicData.nowPlaying = null;
				musicData.songDispatcher = null;
				if (message.guild.me.voice.channel) {
					setTimeout(function onTimeOut() {
						if (musicData.isPlaying == false && message.guild.me.voice.channel) {
							message.guild.me.voice.channel.leave();
							message.channel.send(':zzz: Left channel due to inactivity.');
						}
					}, 90000);
				}
			}
		})
		dispatcher.on('error', async function (e) {
			message.channel.send('Cannot play song!');
      message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
message.guild.musicData.queue.unshift(message.guild.musicData.previous[message.guild.musicData.previous.length - 1] == message.guild.musicData.nowPlaying ? message.guild.musicData.previous[message.guild.musicData.previous.length - 2] : message.guild.musicData.previous[message.guild.musicData.previous.length - 1])
			await updateQueue(message, client)
      module.exports.play(message, voiceChannel, client);
			//console.log(e);
			if (musicData.queue.length > 1) {
				musicData.queue.shift();
				await updateQueue(message, client)
				module.exports.play(message, voiceChannel, client);
				return;
			}
			musicData.queue.length = 0;
			musicData.isPlaying = false;
			musicData.nowPlaying = null;
			musicData.loopSong = false;
			musicData.songDispatcher = null;
			message.guild.me.voice.channel.leave();
			return;
		});
	}
}
