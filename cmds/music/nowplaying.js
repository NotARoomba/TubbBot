
module.exports = class NowPlayingCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      group: 'music',
      memberName: 'nowplaying',
      aliases: ['np', 'currently-playing', 'now-playing'],
      guildOnly: true,
      description: 'Display the currently playing song!'
    });
  }

  run(message) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    if (
      (!message.guild.musicData.isPlaying &&
        !message.guild.musicData.nowPlaying)
    ) {
      return message.say(
        'Please join a voice channel and try again!'
      );
    }

    var position = 0;
    console.log(message.guild.musicData)
    if (message.guild.musicData.connection && message.guild.musicData.connection.dispatcher) position = (message.guild.musicData.connection.dispatcher.streamTime - message.guild.musicData.startTime);
    var processBar = [];
    for (let i = 0; i < 20; i++) processBar.push("═");
    var progress = 0;
    const isLive = message.guild.musicData.songs[0].isLive;
    const length = isLive ? 0 : ms(message.guild.musicData.songs[0].time);
    if (isLive) {
      processBar.splice(19, 1, "■");
      var positionTime = "∞";
    } else {
      var positionTime = moment.duration(Math.round(position / 1000), "seconds").format();
      if (position === 0 || isNaN(position))
        positionTime = "0:00";
      progress = Math.floor((position / length) * processBar.length);
      processBar.splice(progress, 1, "■");
    }

    const videoEmbed = new Discord.MessageEmbed()
      .setThumbnail(video.thumbnail)
      .setColor('#AEA200')
      .setTitle(`:notes: ${title}`)
      .setURL(video.url)
      .setDescription(positionTime);
    message.channel.send(videoEmbed);
    return;
  }
}