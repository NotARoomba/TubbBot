const Discord = require('discord.js');
module.exports = {
    name: 'search',
    group: 'music',
    usage: 'search (what you want to search for)',
    description: 'Search Youtube for a song!',
    async execute(message, args, client) {
        client.player.search(args).then((response) => {
            if (response.length < 5 || !response) {
                return message.say(`I had some trouble finding what you were looking for, please try again or be more specific.`);
            }
            const vidNameArr = [];
            for (let i = 0; i < response.length; i++) {
                vidNameArr.push(
                    `${i + 1}: [${response[i].title
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&apos;/g, "'")
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&#39;/g, "'")}](http://youtu.be/${response[i].id})`
                );
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#FFED00')
                .setTitle(`:mag: Search Results!`)
                .addField(':notes: Result 1', vidNameArr[0])
                .setURL(`http://youtu.be/${response[0].id}`)
                .addField(':notes: Result 2', vidNameArr[1])
                .addField(':notes: Result 3', vidNameArr[2])
                .addField(':notes: Result 4', vidNameArr[3])
                .addField(':notes: Result 5', vidNameArr[4])
                // .addField(':notes: Result 6', vidNameArr[5])
                // .addField(':notes: Result 7', vidNameArr[6])
                // .addField(':notes: Result 8', vidNameArr[7])
                // .addField(':notes: Result 9', vidNameArr[8])
                // .addField(':notes: Result 10', vidNameArr[9])
                .setThumbnail(response[0].thumbnail.url)
            message.channel.send(embed)
        })

    }
}