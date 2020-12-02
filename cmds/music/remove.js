const { Command } = require('discord.js-commando');
const config = require('@root/config.json');
const Discord = require('discord.js');
module.exports = class RemoveSongCommand extends Command {
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
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
    if (songNumber < 1 || songNumber >= message.guild.musicData.queue.length) {
      return message.reply(':x: Please enter a valid song number!');
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply(':no_entry: Please join a voice channel and try again!');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      message.reply(':x: There is no song playing right now!');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `:no_entry: You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }

    message.guild.musicData.queue.splice(songNumber - 1, 1);
    message.say(`:wastebasket: Removed song number ${songNumber} from queue!`);
  }
};