module.exports = {
    name: 'shuffle',
    description: 'Shuffle the music queue!',
    async execute(message, args, client) {
        client.player.shuffle(message)
    }
}