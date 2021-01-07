
const { updateQueue, setQueue, getQueues } = require("./main.js");
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
            ':loud_sound: What volume would you like to set? From 1 to 1000!',
          type: 'integer',
          // default: 25,
          validate: function (wantedVolume) {
            return wantedVolume >= 1 && wantedVolume <= 1000;
          }
        }
      ]
    });
  }

  async run(message, { wantedVolume }) {
    const queue = getQueues();
    let serverQueue = queue.get(message.guild.id);
    if (!serverQueue || !serverQueue.songs || !Array.isArray(serverQueue.songs)) serverQueue = setQueue(message.guild.id, [], false, false, message.pool);
    if (!serverQueue.songs.length) return await message.channel.send("There is nothing playing. Volume didn't change.");
    if ((message.member.voice.channelID !== message.guild.me.voice.channelID) && serverQueue.playing) return message.channel.send("You have to be in a voice channel to alter the volume when the bot is playing!");
    serverQueue.volume = wantedVolume / 100;
    message.channel.send("Volume has been changed to **" + (serverQueue.volume * 100) + "%**.");
    if (serverQueue.connection && serverQueue.playing && serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.setVolume(serverQueue.songs[0] && serverQueue.songs[0].volume ? serverQueue.volume * serverQueue.songs[0].volume : serverQueue.volume);
    updateQueue(message, serverQueue, null);
  }
}