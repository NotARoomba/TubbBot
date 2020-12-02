const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      aliases: [`repeat`, 'l'],
      group: 'music',
      memberName: 'loop',
      guildOnly: true,
      description: 'Loop the currently playing song!'
    });
  }

  run(message) {
    console.log(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
    if (!message.guild.musicData.isPlaying) {
      return message.say(':x: There is no song playing right now!');
    } else if (
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    ) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }

    if (message.guild.musicData.loopSong) {
      message.guild.musicData.loopSong = false;
      message.channel.send(
        `**${message.guild.musicData.nowPlaying.title}** is no longer playing on repeat :repeat: `
      );
    } else {
      message.guild.musicData.loopSong = true;
      message.channel.send(
        `**${message.guild.musicData.nowPlaying.title}** is now playing on repeat :repeat: `
      );
    }
  }
};