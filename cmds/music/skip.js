const { isValidCommander } = require("../../function");
const { play } = require('./play');
module.exports = {
    name: 'skip',
    group: 'music',
    usage: 'skip',
    aliases: ['s'],
    description: 'Skip the current playing song!',
    async execute(message) {
        if (isValidCommander(message) !== true) return
        message.guild.musicData.loopSong = false;
        message.guild.musicData.songDispatcher.end();
        //await play(message, message.guild.musicData.voiceChannel)
        message.react("👌");
    }
}