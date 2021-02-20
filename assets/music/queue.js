const Pagination = require('discord-paginationembed');
module.exports = {
    name: 'queue',
    aliases: ['song-list', 'next-songs', 'q'],
    description: 'Display the song queue!',
    async execute(message, args, client) {
        try {
            let queue = client.player.getQueue(message)
            queue = queue.tracks
            const queueClone = queue;
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
        } catch (err) {
            message.channel.send(`There are no songs in queue!`)
        }
    }
}