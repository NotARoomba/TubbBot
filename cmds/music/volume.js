module.exports = {
    name: 'volume',
    group: 'music',
    usage: 'volume (volume)',
    aliases: ['v', 'vol'],
    description: 'Adjust song volume!',
    async execute(message, args, client) {
        let queue = client.player.getQueue(message);
        if (isNaN(Number(args))) return message.reply(`that is not a number.`);
        queue.setVolume(message, args);
        message.channel.send(`Changed the volume to ${args}%`);
    }
}