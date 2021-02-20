module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'Skip the current playing song!',
    async execute(message, args, client) {
        client.player.skip(message)
        message.react("👌");
    }
}