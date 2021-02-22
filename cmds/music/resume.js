module.exports = {
    name: 'resume',
    group: 'music',
    description: 'Resume the current playing song!',
    async execute(message, args, client) {
        client.player.resume(message)
        message.react("▶️")
    }
}