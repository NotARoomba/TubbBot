
module.exports = class LeaveCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['end', 'stop'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Leaves voice channel if in one!'
    });
  }

  run(message) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Please join a voice channel and try again!');
      return;
    } else if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    } else if (message.guild.musicData.songDispatcher.paused) {
      message.guild.musicData.songDispatcher.resume();
      message.guild.musicData.queue.length = 0;
      message.guild.musicData.loopSong = false;
      setTimeout(() => {
        message.guild.musicData.songDispatcher.end();
        message.guild.me.voice.channel.leave();
        message.say(':wave:')
      }, 100);
      return;
    } else {
      message.guild.musicData.queue.length = 0;
      message.guild.musicData.skipTimer = true;
      message.guild.musicData.loopSong = false;
      message.guild.musicData.loopQueue = false;
      message.guild.musicData.songDispatcher.end();
      message.guild.me.voice.channel.leave();
      message.say(':wave:')
      return;
    }
  }
};