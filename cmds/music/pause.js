module.exports = {
    name: 'pause',
    description: 'Pause the current playing song!',
    async execute(message, args, client) {
        client.player.pause(message)
        message.channel.send(':pause_button: Song was paused!');
    }
}