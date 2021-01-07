const { getQueues } = require("./main.js");
module.exports = class RemoveSongCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      memberName: 'remove',
      group: 'music',
      description: 'Remove a specific song from queue!',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            ':wastebasket: What song number do you want to remove from queue?',
          type: 'integer'
        }
      ]
    });
  }
  run(message, { songNumber }) {
    const queue = getQueues();
    const serverQueue = queue.get(message.guild.id);
    console.log(serverQueue.length)
    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    if (songNumber < 1 || songNumber >= serverQueue.length) {
      return message.reply(':x: Please enter a valid song number!');
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply(':no_entry: Please join a voice channel and try again!');
      return;
    }

    if (
      typeof serverQueue.connection.dispatcher == 'undefined' ||
      serverQueue.connection.dispatcher == null
    ) {
      message.reply(':x: There is no song playing right now!');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `:no_entry: You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }

    serverQueue.splice(songNumber - 1, 1);
    message.say(`:wastebasket: Removed song number ${songNumber} from queue!`);
  }
};