const Discord = require('discord.js');
const request = require('node-superfetch');
module.exports = {
    name: 'dictionary',
    group: 'utility',
    usage: `dictionary (word)`,
    aliases: ['d', 'word'],
    description: 'Responds with information on a word.',
    async execute(message, word) {
        try {
            const { body } = await request
                .get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
                .query({ key: process.env.WEBSTER });
            if (!body.length) return null;
            const data = body[0];
            if (typeof data === 'string') return null;
            const name = data.meta.stems[0]
            const partOfSpeech = data.fl
            const definition = data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')
            const info = new Discord.MessageEmbed()
                .setColor('#f0c018')
                .setFooter('Powered by Merriam-Webster', 'https://merriam-webster.com/assets/mw/static/social-media-share/mw-logo-245x245@1x.png')
                .setTitle(`${name}, ${partOfSpeech}`)
                .setDescription(definition)
            message.reply(info)
        } catch (err) {
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}