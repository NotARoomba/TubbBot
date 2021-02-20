module.exports = {
    name: 'move',
    aliases: ['m'],
    description: 'Move Tubb to another voice channel!',
    async execute(message, args, client) {
        client.player.moveTo(message, message.member.voice.channel)
        message.react("👌")
    }
}