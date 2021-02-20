module.exports = {
    name: 'resume',
    description: 'Resume the current playing song!',
    async execute(message, args, client) {
        client.player.resume(message)
        message.react("▶️")
    }
}