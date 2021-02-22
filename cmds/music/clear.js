module.exports = {
    name: 'clear',
    group: 'music',
    aliases: ['clearqueue', 'skipall'],
    description: 'Clears the queue!',
    async execute(message, args, client) {
        client.player.clearQueue(message)
        message.react("👌");
    }
}