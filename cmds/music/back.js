module.exports = {
    name: 'back',
    group: 'music',
    aliases: ['b'],
    description: 'Play back the previous song!',
    async execute(message, args, client) {
        client.player.back(message)
        message.react("⏮️");
    }
}