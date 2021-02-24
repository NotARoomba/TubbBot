module.exports = {
    name: 'back',
    group: 'music',
    usage: 'play (stuff)',
    aliases: ['b'],
    description: 'Play back the previous song!',
    async execute(message) {
        message.guild.musicData.songDispatcher.pause();
        message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
        message.guild.musicData.queue.unshift(message.guild.musicData.previousTracks[message.guild.musicData.previousTracks.length - 1])
        await play(message, message.guild.musicData.queue[0].voiceChannel)
        message.react("⏮️");
    }
}