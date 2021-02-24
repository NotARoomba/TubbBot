module.exports = {
    name: 'pause',
    group: 'music',
    usage: 'pause',
    description: 'Pause the current playing song!',
    async execute(message, args, client) {
        if (isValidCommander(message, client) !== true) return
        message.guild.musicData.songDispatcher.pause();
        message.react("⏸️")
    }
}