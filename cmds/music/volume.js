module.exports = {
    name: 'volume',
    group: 'music',
    usage: 'volume (volume)',
    aliases: ['v', 'vol'],
    description: 'Adjust song volume!',
    async execute(message, args, client) {
        client.player.getQueue(message);
        if (isNaN(Number(args))) return message.reply(`that is not a number.`);
        client.player.setVolume(message, Number(args));
        message.channel.send(`Changed the volume to ${args}%`);
    }
}