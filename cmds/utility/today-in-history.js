const Discord = require("discord.js");
const request = require('node-superfetch');
module.exports = {
    name: 'todayinhistory',
    aliases: ['tih'],
    description: 'Gives info about what important event happend today in hisotry',
    async execute(message, args) {
        args = args.split(" ")
        //console.log(args)
        let month = args[0]
        let day = args[1]
        const date = month && day ? `/${month}/${day}` : '';
        try {
            const { text } = await request.get(`http://history.muffinlabs.com/date${date}`);
            const body = JSON.parse(text);
            const events = body.data.Events;
            const event = events[Math.floor(Math.random() * events.length)];
            const embed = new Discord.MessageEmbed()
                .setColor('#484848')
                .setURL(body.url)
                .setTitle(`On this day (${body.date})...`)
                .setTimestamp()
                .setDescription(`${event.year}: ${event.text}`)
                .addField('❯ See More',
                    event.links.map(link => `[${link.title}](${link.link.replace(/\)/g, '%29')})`).join(', '));

            return message.channel.send(embed);
        }
        catch (err) {
            if (err.status === 404 || err.status === 500) return message.reply('Invalid date. The date should be in month-day number form, 1 1 or 12 31.');
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}