const { isValidCommander } = require('../../function.js')
module.exports = {
    name: 'remove',
    group: 'music',
    usage: 'remove (queued song number)',
    description: 'Remove a specific song from the queue!',
    async execute(message, args) {
        if (isValidCommander(message) !== true) return
        if (isNaN(Number(args))) return message.reply(`that is not a number.`)
        queue = message.guild.musicData.queue
        if (args == 0 || args > queue.length || args.includes('.')) return message.reply(`that is not a valid queued song.`);
        queue.splice(args - 1, 1);
        message.channel.send(`:wastebasket: Removed song number ${args} from queue!`);
    }
}