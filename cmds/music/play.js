const { validYTURL, validSPURL, validGDURL, validGDFolderURL, validYTPlaylistURL, validSCURL, addYTURL } = require("../../function.js");
const ytdl = require('discord-ytdl-core');
var cookie = { cookie: process.env.COOKIE, id: 0 };
const Discord = require('discord.js');
module.exports = {
    name: 'play',
    aliases: ['p2'],
    description: 'Plays music!',
    async execute(message, args) {
        const musicData = message.guild.musicData
        const voiceChannel = message.member.voice.channel;
        musicData.voiceChannel = voiceChannel
        if (!voiceChannel) {
            message.reply('please join a voice channel and try again!');
            return;
        }
        try {
            let result = []
            if (validYTPlaylistURL(args)) result.push(await addYTPlaylist(message, args, voiceChannel));
            else if (validYTURL(args)) result.push(await addYTURL(message, args, voiceChannel));
            else if (validSPURL(args)) result.push(await addSPURL(message, args, voiceChannel));
            else if (validSCURL(args)) result.push(await addSCURL(message, args, voiceChannel));
            else if (validGDFolderURL(args)) result.push(await addGDFolderURL(message, args, voiceChannel));
            else if (validGDURL(args)) result.pushawait(addGDURL(message, args, voiceChannel));
            else if (message.attachments.size > 0) result.push(await addAttachment(message, voiceChannel));
            else result.push(await search(message, args, voiceChannel));
            result.forEach(track => {
                musicData.queue.push(track)
            });
            const addembed = new Discord.MessageEmbed()
                .setColor('#FFED00')
                .setTitle(`:musical_note: ${result[0].title}`)
                .setDescription(`Has been added to queue.\nThis song is #${musicData.queue.length} in queue`)
                .setThumbnail(result[0].thumbnail)
                .setURL(result[0].url)
            if (result.length > 1) addembed.setTitle(`:musical_note: ${result.length} tracks were added.`).setThumbnail(result[0].thumbnail).setDescription(`Has been added to queue.\nThese songs are #${musicData.queue.length} in queue`);
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
            .setDescription(`:stopwatch: Duration: ${musicData.queue[0].lengthFormatted}`)
            .setThumbnail(musicData.queue[0].thumbnail)
            .setURL(musicData.queue[0].url)
            .setFooter(`Requested by ${musicData.queue[0].memberDisplayName}!`, musicData.queue[0].memberAvatar)
        if (musicData.queue[0].isLive) npembed.setDescription(':red_circle: Live Stream')
        musicData.queue[0].seek !== 0 ? seek = musicData.queue[0].seek : seek = 0
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
                requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE } },
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
                    musicData.queue.shift()
                    module.exports.musicHandler(message, voiceChannel, npembed)
                })
            } catch (err) { }
        }
    },
    musicHandler(message, voiceChannel, npembed) {
        const musicData = message.guild.musicData
        const dispatcher = musicData.songDispatcher
        dispatcher.on('finish', () => {
            if (musicData.loopSong) {
                queue.unshift(musicData.nowPlaying);
            } else if (musicData.loopQueue) {
                queue.push(musicData.nowPlaying);
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
        dispatcher.on('start', () => {
            message.channel.send(npembed)
        })
        dispatcher.on('error', function (e) {
            message.channel.send('Cannot play song!');
            console.log(e);
            if (queue.length > 1) {
                queue.shift();
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
