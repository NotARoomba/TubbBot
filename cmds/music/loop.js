module.exports = {
    name: 'loop',
    group: 'music',
    usage: 'loop',
    aliases: ['l', 'repeat'],
    description: 'Toggles song loop!',
    async execute(message, args, client) {
        let queue = client.player.getQueue(message)
        if (queue.repeatMode) {
            client.player.setRepeatMode(message, false);
            message.channel.send(`**${client.player.nowPlaying(message).title}** is no longer playing on repeat :repeat: `);
        }
        else {
            client.player.setRepeatMode(message, true);
            message.channel.send(`**${client.player.nowPlaying(message).title}** is now playing on repeat :repeat: `);
        }
    }
}