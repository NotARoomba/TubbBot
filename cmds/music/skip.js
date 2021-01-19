module.exports = class SkipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['skip-song', 'advance-song', 'next', 's'],
      memberName: 'skip',
      group: 'music',
      description: 'Skip the current playing song!',
      guildOnly: true
    });
  }

  run(message) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.reply(
        'Please join a voice channel and try again!'
      );

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('There is no song playing right now!');
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }
    message.guild.musicData.loopSong = false;
    message.guild.musicData.songDispatcher.end();
    message.react("👌");
  }
};