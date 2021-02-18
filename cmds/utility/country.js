const Discord = require('discord.js');
const { formatNumber } = require('../../function.js');
const request = require('node-superfetch');
module.exports = {
    name: "country",
    description: 'Responds with information on a country.',
    async execute(message, query) {
        try {
            query => encodeURIComponent(query)
            const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${query}`);
            const data = body[0];
            const embed = new Discord.MessageEmbed()
                .setColor('#484848')
                .setTitle(data.name)
                .setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
                .addField('❯ Population', formatNumber(data.population), true)
                .addField('❯ Capital', data.capital || 'None', true)
                .addField('❯ Currency', data.currencies[0].symbol, true)
                .addField('❯ Location', data.subregion || data.region, true)
                .addField('❯ Demonym', data.demonym || 'None', true)
                .addField('❯ Native Name', data.nativeName, true)
                .addField('❯ Area', `${formatNumber(data.area)}km`, true)
                .addField('❯ Languages', data.languages.map(lang => lang.name).join('/'));
            return message.reply(embed);
        } catch (err) {
            if (err.status === 404) return message.say('Could not find any results.');
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}