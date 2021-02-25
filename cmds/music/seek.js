const { play } = require('./play');
module.exports = {
    name: 'seek',
    group: 'music',
    usage: 'seek (time in seconds)',
    description: 'Go to a time in the song!',
    async execute(message, args) {
        if (isNaN(parseInt(args))) return message.reply(`that is not a parseInt.`)
        if (parseInt(args) < 0 || parseInt(args) > message.guild.musicData.nowPlaying.lengthSeconds) return message.reply(`that is not a valid time.`);
        message.guild.musicData.songDispatcher.pause();
        message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying)
        message.guild.musicData.queue[0].seek = Math.round(parseInt(args))
        await play(message, message.guild.musicData.queue[0].voiceChannel)
        message.channel.send(`Forwarding **${message.guild.musicData.nowPlaying.title}** to \`\`${Math.round(parseInt(args))}\`\` seconds :fast_forward: `)
    }
}