const { play } = require('./play');
module.exports = {
    name: 'back',
    group: 'music',
    usage: 'play (stuff)',
    aliases: ['b'],
    description: 'Play back the previous song!',
    async execute(message) {
        message.guild.musicData.songDispatcher.pause();
        message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
        message.guild.musicData.queue.unshift(message.guild.musicData.previous[message.guild.musicData.previous.length - 2])
        await play(message, message.guild.musicData.voiceChannel)
        message.react("⏮️");
    }
}