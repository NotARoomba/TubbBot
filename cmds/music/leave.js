module.exports = {
    name: 'leave',
    group: 'music',
    aliases: ['stop'],
    description: 'Leaves voice channel if in one!',
    async execute(message, args, client) {
        client.player.stop(message)
        message.channel.send(':wave:');
    }
}