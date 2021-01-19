
module.exports = class SkipAllCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      aliases: ['skip-all', 'sa', 'clear'],
      memberName: 'clear',
      group: 'music',
      description: 'clear songs in queue!',
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

    if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }
    if (!message.guild.musicData.queue)
      return message.say('There are no songs in queue!');
    message.guild.musicData.queue.length = 0; // clear queue
    message.guild.musicData.loopSong = false;
    message.guild.musicData.loopQueue = false;
    message.guild.musicData.songDispatcher.end();
    return message.react("👌");
  }
};