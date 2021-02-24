const { validYTURL, validSPURL, validGDURL, validGDFolderURL, validYTPlaylistURL, validSCURL, addYTURL } = require("../../function.js");
const ytdl = require('discord-ytdl-core');
var cookie = { cookie: process.env.COOKIE, id: 0 };
const Discord = require('discord.js');
module.exports = {
    name: 'play2',
    aliases: ['p2'],
    description: 'Plays music!',
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
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
                client.musicData.queue.push(track)
            });
            const addembed = new Discord.MessageEmbed()
                .setColor('#FFED00')
                .setTitle(`:musical_note: ${result[0].title}`)
                .setDescription(`Has been added to queue.\nThis song is #${client.musicData.queue.length} in queue`)
                .setThumbnail(result[0].thumbnail)
                .setURL(result[0].url)
            if (result.length > 1) addembed.setTitle(`:musical_note: ${result.length} tracks were added.`).setThumbnail(result[0].thumbnail).setDescription(`Has been added to queue.\nThese songs are #${client.musicData.queue.length} in queue`);
            if (typeof client.musicData.songDispatcher == 'undefined' || client.musicData.songDispatcher == null) {
                module.exports.play(message, client, voiceChannel)
            } else message.channel.send(addembed)
        } catch (err) {
            console.log(err)
        }
    },
    async play(message, client, voiceChannel) {
        const npembed = new Discord.MessageEmbed()
            .setColor('#FFED00')
            .setTitle(`:notes: Now Playing: ${client.musicData.queue[0].title}`)
            .setDescription(':stopwatch: Duration:', client.musicData.queue[0].lengthFormatted)
            .setThumbnail(client.musicData.queue[0].thumbnail)
            .setURL(client.musicData.queue[0].url)
            .setFooter(`Requested by ${client.musicData.queue[0].memberDisplayName}!`, client.musicData.queue[0].memberAvatar)
        if (client.musicData.queue[0].isLive) npembed.setDescription(':stopwatch: Duration: 🔴 Live ')
        if (client.musicData.queue[0].type == 0) {
            const stream = ytdl(client.musicData.queue[0].url, {
                filter: "audio",
                dlChunkSize: 0,
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                opusEncoded: true,
                requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE } },
                encoderArgs: ['-af', 'dynaudnorm=f=200']
            })
            try {
                voiceChannel.join().then(async (connection) => {
                    await connection.voice.setSelfDeaf(true);
                    await connection.voice.setDeaf(true);
                    client.musicData.connection = connection
                    const dispatcher = connection.play(stream, {
                        type: 'opus',
                    })
                    message.channel.send(npembed)
                    client.musicData.songDispatcher = dispatcher
                    dispatcher.setVolume(client.musicData.volume);
                    client.musicData.nowPlaying = client.musicData.queue[0];
                    client.musicData.previous.push(client.musicData.queue.shift())
                    module.exports.musicHandler(message, client, voiceChannel)
                })
            } catch (err) { }
        }
    },
    musicHandler(message, client, voiceChannel) {
        const dispatcher = client.musicData.songDispatcher
        dispatcher.on("finish", () => {
            if (client.musicData.loopSong) {
                queue.unshift(client.musicData.nowPlaying);
            } else if (client.musicData.loopQueue) {
                queue.push(client.musicData.nowPlaying);
            }
            if (client.musicData.queue.length >= 1) {
                module.exports.play(message, client, voiceChannel);
                return;
            } else {
                client.musicData.isPlaying = false;
                client.musicData.nowPlaying = null;
                client.musicData.songDispatcher = null;
                if (message.guild.me.voice.channel) {
                    setTimeout(function onTimeOut() {
                        if (client.musicData.isPlaying == false && message.guild.me.voice.channel) {
                            message.guild.me.voice.channel.leave();
                            message.channel.send(':zzz: Left channel due to inactivity.');
                        }
                    }, 90000);
                }
            }
        })
        dispatcher.on('error', function (e) {
            message.say('Cannot play song!');
            console.log(e);
            if (queue.length > 1) {
                queue.shift();
                module.exports.play(message, client, voiceChannel);
                return;
            }
            client.musicData.queue.length = 0;
            client.musicData.isPlaying = false;
            client.musicData.nowPlaying = null;
            client.musicData.loopSong = false;
            client.musicData.songDispatcher = null;
            message.guild.me.voice.channel.leave();
            return;
        });
    }
}
