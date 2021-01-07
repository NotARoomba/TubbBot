
const Discord = require("discord.js");
const { updateQueue, getQueues } = require("./main.js");
const { createEmbedScrolling, streamToString, requestStream } = require("@util/function.js");
module.exports = class QueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      aliases: ['song-list', 'next-songs', 'q'],
      group: 'music',
      memberName: 'queue',
      guildOnly: true,
      description: 'Display the song queue!'
    });
  }

  async run(message) {
    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    const queue = getQueues();
    let serverQueue = queue.get(message.guild.id);

    if (serverQueue.songs.length < 1) return message.channel.send("Nothing is in the queue now.");
    const filtered = serverQueue.songs.filter(song => !!song);
    if (serverQueue.songs.length !== filtered.length) {
      serverQueue.songs = filtered;
      updateQueue(message, serverQueue);
    }
    var index = 0;
    function getIndex() {
      if (index == 0 || !serverQueue.random) return ++index;
      return "???";
    }
    const songArray = serverQueue.songs.map(song => `**${getIndex()} - ** **[${song.title}](${song.type === 1 ? song.spot : song.url})** : **${song.time}**`);
    const allEmbeds = [];
    for (let i = 0; i < Math.ceil(songArray.length / 10); i++) {
      const pageArray = songArray.slice(i * 10, i * 10 + 10);
      const queueEmbed = new Discord.MessageEmbed()
        .setColor('#dbc300')
        .setTitle(`Song queue for ${message.guild.name} [${i + 1}/${Math.ceil(songArray.length / 10)}]`)
        .setDescription(`There are ${songArray.length} tracks in total.\n\n${pageArray.join("\n")}`)
        .setTimestamp()
        .setFooter(`Now playing: ${(serverQueue.songs[0] ? serverQueue.songs[0].title : "Nothing")}`, message.client.user.displayAvatarURL());
      allEmbeds.push(queueEmbed);
    }
    if (allEmbeds.length == 1) message.channel.send(allEmbeds[0]).then(message => setTimeout(() => message.edit({ embed: null, content: `**[Queue: ${songArray.length} tracks in total]**` }), 60000));
    else await createEmbedScrolling(message, allEmbeds, 3, { songArray: songArray });
  }

}