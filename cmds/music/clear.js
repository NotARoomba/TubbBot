const { isValidCommander } = require('../../function.js')
module.exports = {
    name: 'clear',
    group: 'music',
    usage: 'play (stuff)',
    aliases: ['clearqueue', 'skipall'],
    description: 'Clears the queue!',
    async execute(message) {
        if (!message.guild.musicData.queue[0]) return message.reply('there are no songs in queue!');
        message.guild.musicData.queue.length = 0; // clear queue
        message.guild.musicData.loopSong = false;
        message.guild.musicData.loopQueue = false;
        message.guild.musicData.songDispatcher.end();
        message.react("👌");
    }
}