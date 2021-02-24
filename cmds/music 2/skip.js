module.exports = {
    name: 'skip',
    group: 'music',
    usage: 'skip',
    aliases: ['s2'],
    description: 'Skip the current playing song!',
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Please join a voice channel and try again!');
        } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
            message.reply(`You must be in the same voice channel as the bot's in order to use that!`);
            return;
        } if (typeof client.musicData.songDispatcher == 'undefined' || client.musicData.songDispatcher == null) {
            return message.reply('There is no song playing right now!');
        }
        client.musicData.loopSong = false;
        client.musicData.songDispatcher.end();
        message.react("👌");
    }
}