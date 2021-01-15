
module.exports = class ResumeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      aliases: ['resume-song', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'Resume the current paused song!',
      guildOnly: true
    });
  }

  run(message) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.reply(
        'Please join a voice channel and try again!'
      );

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher === null
    ) {
      return message.reply('There is no song playing right now!');
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }

    message.say(':play_pause: Song resumed!');

    message.guild.musicData.songDispatcher.resume();
  }
};