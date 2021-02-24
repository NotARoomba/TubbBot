const Pagination = require('discord-paginationembed');
module.exports = {
    name: 'queue2',
    group: 'music',
    usage: 'queue',
    aliases: ['song-list', 'next-songs', 'q2'],
    description: 'Display the song queue!',
    async execute(message, args, client) {
        try {
            const queueClone = client.musicData.queue;
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