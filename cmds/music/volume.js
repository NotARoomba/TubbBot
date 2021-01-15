
module.exports = class VolumeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['change-volume', 'v', 'vol'],
      group: 'music',
      memberName: 'volume',
      guildOnly: true,
      description: 'Adjust song volume!',
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'wantedVolume',
          prompt:
            ':loud_sound: What volume would you like to set? from 1 to 1000!',
          type: 'integer',
          default: 'NaN',
        }
      ]
    });
  }

  run(message, { wantedVolume }) {
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
    if (wantedVolume == 'NaN') return message.say(`The volume is currently at ${message.guild.musicData.volume}%`)
    if (!wantedVolume >= 1 && wantedVolume <= 1000) return message.say(`Please make sure that the volume is within 1-1000`)
    const volume = wantedVolume / 100;
    message.guild.musicData.volume = volume;
    message.guild.musicData.songDispatcher.setVolume(volume);
    message.say(`:loud_sound: Setting the volume to: ${wantedVolume}%!`);
  }
};