const { validYTURL, validSPURL, validGDURL, validGDFolderURL, validYTPlaylistURL, validSCURL, addYTURL } = require("../../function.js");
const ytdl = require('ytdl-core');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${process.env.DBUSER}:${process.env.DBPASS}@freedb.tech:3306/${process.env.DBNAME}`, {
    logging: false
})
var cookie = { cookie: process.env.COOKIE, id: 0 };
module.exports = {
    name: 'pla2y',
    aliases: ['p2'],
    description: 'Plays music!',
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.reply('please join a voice channel and try again!');
            return;
        }
        try {
            if (validYTPlaylistURL(args)) result = await addYTPlaylist(message, args);
            else if (validYTURL(args)) result = await addYTURL(message, args);
            else if (validSPURL(args)) result = await addSPURL(message, args);
            else if (validSCURL(args)) result = await addSCURL(message, args);
            else if (validGDFolderURL(args)) result = await addGDFolderURL(message, args);
            else if (validGDURL(args)) result = await addGDURL(message, args);
            else if (message.attachments.size > 0) result = await addAttachment(message);
            else result = await search(message, args);
            client.musicData.queue.push(result)
            module.exports.play(message, client, voiceChannel)
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
            await voiceChannel.join().then(async (connection) => {
                connection.voice.setSelfDeaf(true);
                musicData.connection = connection
                const dispatcher = connection.play(ytdl(queue[0].url), {
                    filter: "audio",
                    dlChunkSize: 0,
                    quality: 'highestaudio',
                    highWaterMark: 1 << 25,
                    requestOptions: { headers: { cookie: cookie.cookie, 'x-youtube-identity-token': process.env.YOUTUBE } },
                    encoderArgs: ['-af', 'areverse']
                })
                musicData.songDispatcher = dispatcher
                dispatcher.setVolume(musicData.volume);
                musicData.nowPlaying = queue[0];
                queue.shift();
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
                    }
                })
        }
    }
}
