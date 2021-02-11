const Discord = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../function.js');
module.exports = {
    name: 'wikipedia',
    aliases: 'wiki',
    description: 'Searches Wikipedia for your query.',
    async execute(message, query) {

        try {
            const { body } = await request
                .get('https://en.wikipedia.org/w/api.php')
                .query({
                    action: 'query',
                    prop: 'extracts|pageimages',
                    format: 'json',
                    titles: query,
                    exintro: '',
                    explaintext: '',
                    pithumbsize: 150,
                    redirects: '',
                    formatversion: 2
                });
            const data = body.query.pages[0];
            if (data.missing) return message.say('Could not find any results.');
            const embed = new Discord.MessageEmbed()
                .setColor('#484848')
                .setTitle(data.title)
                .setAuthor('Wikipedia', 'https://i.imgur.com/Z7NJBK2.png', 'https://www.wikipedia.org/')
                .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
                .setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(query).replace(')', '%29')}`)
                .setDescription(shorten(data.extract.replace('\n', '\n\n')));
            return message.reply(embed);
        } catch (err) {
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}