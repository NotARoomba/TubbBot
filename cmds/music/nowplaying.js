module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Clears the queue!',
    async execute(message, args, client) {
        client.player.clearQueue(message)
        message.react("👌");
    }
}