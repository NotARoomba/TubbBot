const Discord = require('discord.js');
module.exports = {
    name: 'play',
    group: 'music',
    usage: 'play (Youtube, Spotify, Soundcloud link, or the name of a song)',
    aliases: ['p'],
    description: 'Plays music!',
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.say('Please join a voice channel and try again!');
            return;
        }
        client.player.play(message, args, true);
    }
}