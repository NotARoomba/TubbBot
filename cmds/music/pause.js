module.exports = {
    name: 'pause',
    group: 'music',
    usage: 'pause',
    description: 'Pause the current playing song!',
    async execute(message, args, client) {
        client.player.pause(message)
        message.react("⏸️")
    }
}