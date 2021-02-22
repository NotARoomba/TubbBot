module.exports = {
    name: 'remove',
    group: 'music',
    description: 'Remove a specific song from the queue!',
    async execute(message, args, client) {
        if (isNaN(Number(args))) return message.reply(`that is not a number.`)
        let queue = client.player.getQueue(message);
        queue = queue.tracks
        if (args == 0 || args > queue.length || args.includes('.')) return message.reply(`that is not a valid queued song.`);
        client.player.remove(message, args);
        message.channel.send(`:wastebasket: Removed song number ${args} from queue!`);
    }
}