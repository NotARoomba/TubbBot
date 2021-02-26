const { isValidCommander, arrayMove, updateQueue } = require('../../function.js')
module.exports = {
    name: 'move',
    group: 'music',
    usage: 'move',
    aliases: ['m'],
    description: 'Move Tubb to another voice channel!',
    async execute(message, args, client) {
        if (isValidCommander(message) !== true) return
        args = args.split(" ")
        if (args[0] < 1 || args[0] > message.guild.musicData.queue.length || args[1] < 1 || args[1] > message.guild.musicData.queue.length || args[0] == args[1] || typeof parseInt(args[0]) !== 'number' || typeof parseInt(args[1]) !== 'number') {
            message.reply('Try again and enter a valid song position number');
            return;
        } else if (message.guild.musicData.loopSong) {
            message.reply('Turn off the **loop** command before using the **move** command.');
            return;
        }
        const songName = message.guild.musicData.queue[args[0] - 1].title;
        arrayMove(message.guild.musicData.queue, args[0] - 1, args[1] - 1);
        await updateQueue(message, client)
        message.channel.send(`**${songName}** moved to position ${args[1]}`);
    }
}