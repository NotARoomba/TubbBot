const { isValidCommander } = require("../../function");

module.exports = {
    name: 'skip',
    group: 'music',
    usage: 'skip',
    aliases: ['s'],
    description: 'Skip the current playing song!',
    async execute(message, args) {
        if (isValidCommander(message) !== true) return
        message.guild.musicData.loopSong = false;
        message.guild.musicData.songDispatcher.end();
        message.react("👌");
    }
}