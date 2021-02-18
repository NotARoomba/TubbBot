module.exports = {
    name: 'queue',
    aliases: ['song-list', 'next-songs', 'q'],
    description: 'Display the song queue!',
    async execute(message, args, client) {
        console.log(client.player.getQueue(message))
    }
}