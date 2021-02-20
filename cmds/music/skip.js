module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'Skip the current playing song!',
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.reply('please join a voice channel and try again!');
        if (voiceChannel.id !== message.guild.me.voice.channel.id) {
            message.reply(`you must be in the same voice channel as Tubb in order to use that!`);
            return;
        }
        if (typeof client.musicData.songDispatcher == 'undefined' || client.musicData.songDispatcher == null) {
            return message.reply('there is no song playing right now!');
        }
        client.musicData.loopSong = false;
        client.musicData.songDispatcher.end();
        message.react("👌");
    }
}