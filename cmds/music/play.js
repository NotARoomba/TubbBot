const { validYTURL, validSPURL, validGDURL, validGDFolderURL, validYTPlaylistURL, validSCURL, addYTURL } = require("../../function.js");
const ytdl = require('discord-ytdl-core');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`, {
    logging: false
})
var cookie = { cookie: process.env.COOKIE, id: 0 };
module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays music!',
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.reply('please join a voice channel and try again!');
            return;
        }
        try {
            if (validYTPlaylistURL(args)) result = await addYTPlaylist(message, args, voiceChannel);
            else if (validYTURL(args)) result = await addYTURL(message, args, voiceChannel);
            else if (validSPURL(args)) result = await addSPURL(message, args, voiceChannel);
            else if (validSCURL(args)) result = await addSCURL(message, args, voiceChannel);
            else if (validGDFolderURL(args)) result = await addGDFolderURL(message, args, voiceChannel);
            else if (validGDURL(args)) result = await addGDURL(message, args, voiceChannel);
            else if (message.attachments.size > 0) result = await addAttachment(message, voiceChannel);
            else result = await search(message, args, voiceChannel);
            client.musicData.queue.push(result)
            if (typeof client.musicData.songDispatcher == 'undefined' || client.musicData.songDispatcher == null) {
                module.exports.play(message, client, voiceChannel)
            }
        } catch (err) {
            console.log(err)
        }
    },
    async play(message, client, voiceChannel) {
        const musicData = client.musicData
        const queue = musicData.queue
        const Volume = sequelize.define('volume', {
            guild: Sequelize.STRING,
            volume: Sequelize.BIGINT
        })
        Volume.sync();
        const volume = await Volume.findOne({ where: { guild: message.guild.id } });
        if (volume == null || undefined) {
            await Volume.create({
                guild: message.guild.id,
                volume: 1,
            });
        }
        const newvolume = await Volume.findOne({ where: { guild: message.guild.id } });
        musicData.volume = newvolume.volume
        if (queue[0].type == 0) {
            const stream = ytdl(queue[0].url, {
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
                    musicData.connection = connection
                    let dispatcher = connection.play(stream, {
                        type: 'opus',
                    })
                    musicData.songDispatcher = dispatcher
                    dispatcher.setVolume(musicData.volume);
                    musicData.nowPlaying = queue[0];
                    queue.shift()
                    return;
                })
                    .on("finish", () => {
                        if (musicData.loopSong) {
                            queue.unshift(musicData.nowPlaying);
                        } else if (musicData.loopQueue) {
                            queue.push(musicData.nowPlaying);
                        }
                        if (queue.length >= 1) {
                            module.exports.play(message, client, voiceChannel);
                            return;
                        } else {
                            musicData.isPlaying = false;
                            musicData.nowPlaying = null;
                            musicData.songDispatcher = null;
                            if (message.guild.me.voice.channel) {
                                message.guild.me.voice.channel.leave();
                                message.guild.musicData.skipTimer = false;
                                return;
                            }
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
                    .on('error', function (e) {
                        message.say('Cannot play song!');
                        console.log(e);
                        if (queue.length > 1) {
                            queue.shift();
                            module.exports.play(message, client, voiceChannel);
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
            } catch (err) { }
        }
    }
}
