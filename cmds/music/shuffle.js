const Pagination = require('discord-paginationembed');
module.exports = {
    name: 'shuffle',
    group: 'music',
    description: 'Shuffle the music queue!',
    async execute(message, args, client) {
        client.player.shuffle(message)
        let queue = client.player.getQueue(message)
        queue = queue.tracks
        const queueClone = queue;
        const queueEmbed = new Pagination.FieldsEmbed()
            .setArray(queueClone)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField('# - Song', function (e) {
                return `**${queueClone.indexOf(e) + 1}**: ${e.title}`;
            });

        queueEmbed.embed
            .setColor('#dbc300')
            .setTitle(':twisted_rightwards_arrows: New Music Queue!');
        queueEmbed.build();
    }
}