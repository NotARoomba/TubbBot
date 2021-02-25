const { isValidCommander } = require('../../function.js')
module.exports = {
    name: 'volume',
    group: 'music',
    usage: 'volume (volume)',
    aliases: ['v', 'vol'],
    description: 'Adjust song volume!',
    async execute(message, args) {
        if (isValidCommander(message) !== true) return
        if (isNaN(Number(args))) return message.reply(`that is not a number.`);
        const volume = Number(args) / 100;
        message.guild.musicData.volume = volume;
        message.guild.musicData.songDispatcher.setVolume(volume);
        message.channel.send(`:loud_sound: Setting the volume to: ${args}%!`);
    }
}