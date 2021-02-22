module.exports = {
    name: 'skip',
    group: 'music',
    aliases: ['s'],
    description: 'Skip the current playing song!',
    async execute(message, args, client) {
        client.player.skip(message)
        message.react("👌");
    }
}