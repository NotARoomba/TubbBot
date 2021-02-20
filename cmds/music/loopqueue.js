module.exports = {
    name: 'loopqueue',
    aliases: ['lq'],
    description: 'Toggles queue loop!',
    async execute(message, args, client) {
        let queue = client.player.getQueue(message)
        if (queue.loopMode) {
            await client.player.setLoopMode(message, false);
            message.channel.send(':repeat: The queue is no longer playing on **loop**');
        }
        else {
            await client.player.setLoopMode(message, true);
            message.channel.send(':repeat: The queue is now playing on **loop**');
        }
    }
}