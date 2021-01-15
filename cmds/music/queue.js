
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

  run(message) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    if (message.guild.musicData.queue.length == 0)
      return message.say('There are no songs in queue!');
    const queueClone = message.guild.musicData.queue;
    const queueEmbed = new Pagination.FieldsEmbed()
      .setArray(queueClone)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setElementsPerPage(10)
      .formatField('# - Song', function (e) {
        return `**${queueClone.indexOf(e) + 1}**:  ${e.title}`;
      });

    queueEmbed.embed.setColor('#dbc300').setTitle('Music Queue');
    queueEmbed.build();
  }
};