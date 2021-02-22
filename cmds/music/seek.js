module.exports = {
    name: 'seek',
    group: 'music',
    description: 'Go to a time in the song!',
    async execute(message, args, client) {
        let track = client.player.nowPlaying(message)
        if (isNaN(Number(args))) return message.reply(`that is not a number.`)
        args = Number(args) * 1000
        if (args < 0 || args > track.duration || args.includes('.')) return message.reply(`that is not a valid time.`);
        client.player.seek(message, args);
        message.react("👌");
    }
}