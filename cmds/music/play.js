const { validYTURL, validSPURL, validGDURL, updateQueue, getQueue, validYTPlaylistURL, validSCURL, validURL, addYTURL, addYTPlaylist, addSPURL, addSCURL, addGDURL, addAttachment, addURL, search } = require("../../function.js");
const ytdl = require('discord-ytdl-core');
const scdl = require('soundcloud-downloader').default
var cookie = { cookie: process.env.COOKIE, id: 0 };
const Discord = require('discord.js');
module.exports = {
	name: 'play',
	group: 'music',
	usage: 'p (song name or link)',
	aliases: ['p'],
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
			if (validYTPlaylistURL(args)) result = await addYTPlaylist(message, args, voiceChannel);
			else if (validYTURL(args)) result = await addYTURL(message, args, voiceChannel);
			else if (validSPURL(args)) result = await addSPURL(message, args, voiceChannel);
			else if (validSCURL(args)) result = await addSCURL(message, args, voiceChannel);
			else if (validGDURL(args)) result = await addGDURL(message, args, voiceChannel);
			else if (validURL(args)) result = await addURL(message, args, voiceChannel);
			else if (message.attachments.size > 0) result = await addAttachment(message, voiceChannel);
			else result = await search(message, args, voiceChannel);
			result.forEach(track => {
				musicData.queue.push(track)
			});
			try {
				let dbqueue = await getQueue(message, client)
				if (dbqueue.length !== musicData.queue.length &&dbqueue.length + 1 !== musicData.queue.length && dbqueue !== 404) {
					dbqueue.forEach(track => {
						musicData.queue.push(track)
					});
				}
				await updateQueue(message, client)
			} catch { }
			const addembed = new Discord.MessageEmbed()
				.setColor('#FFED00')
				.setTitle(`:musical_note: ${result[0].title}`)
				.setDescription(`Has been added to the queue.\nThis track is #${musicData.queue.length} in the queue`)
				.setThumbnail(result[0].thumbnail)
				.setURL(result[0].url)
			if (result.length > 1) addembed.setTitle(`:musical_note: ${result.length} tracks were added.`).setThumbnail(result[0].thumbnail).setDescription(`\nThe tracks are #${musicData.queue.length} in the queue`);
			if (typeof musicData.songDispatcher == 'undefined' || musicData.songDispatcher == null) {
				module.exports.play(message, voiceChannel)
			} else message.channel.send(addembed)
		} catch (err) {
			console.log(err)
		}
	},
	async play(message, voiceChannel) {
		const musicData = message.guild.musicData
		const npembed = new Discord.MessageEmbed()
			.setColor('#FFED00')
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
				filter: "audio",
				dlChunkSize: 0,
				quality: 'highestaudio',
				highWaterMark: 1 << 25,
				opusEncoded: true,
				seek: seek,
				encoderArgs: encoderArgs,
			})
			try {
				await voiceChannel.join().then(async (connection) => {
					musicData.connection = connection
					const dispatcher = await connection.play(stream, {
						type: 'opus',
					})
					musicData.isPlaying = true;
					musicData.songDispatcher = dispatcher
					dispatcher.setVolume(musicData.volume);
					musicData.nowPlaying = musicData.queue[0];
					let ended = await musicData.queue.shift()
					musicData.previous.push(ended)
					module.exports.musicHandler(message, voiceChannel)
				})
			} catch (err) { }
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
						type: 'opus'
					})
					musicData.isPlaying = true;
					musicData.songDispatcher = dispatcher
					dispatcher.setVolume(musicData.volume);
					musicData.nowPlaying = musicData.queue[0];
					let ended = await musicData.queue.shift()
					musicData.previous.push(ended)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { }
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
						type: 'opus'
					})
					musicData.isPlaying = true;
					musicData.songDispatcher = dispatcher
					dispatcher.setVolume(musicData.volume);
					musicData.nowPlaying = musicData.queue[0];
					let ended = await musicData.queue.shift()
					musicData.previous.push(ended)
					module.exports.musicHandler(message, voiceChannel, client)
				})
			} catch (err) { }
		}
	},
	musicHandler(message, voiceChannel, client) {
		const musicData = message.guild.musicData
		const dispatcher = musicData.songDispatcher
		dispatcher.on('finish', async () => {
			if (musicData.loopSong) {
				musicData.queue.unshift(musicData.nowPlaying);
				await updateQueue(message, client)
			} else if (musicData.loopQueue) {
				musicData.queue.push(musicData.nowPlaying);
				await updateQueue(message, client)
			}
			if (musicData.queue.length >= 1) {
				module.exports.play(message, voiceChannel);
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
			console.log(e);
			if (musicData.queue.length > 1) {
				musicData.queue.shift();
				await updateQueue(message, client)
				module.exports.play(message, voiceChannel);
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
