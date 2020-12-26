module.exports = class TodayInHistoryCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'todayinhistory',
            aliases: ['tih'],
            group: 'fun',
            memberName: 'todayinhistory',
            description: 'Gives info about what important event happend today in hisotry',
            args: [
                {
                    key: 'month',
                    prompt: 'What month (in number form)?',
                    type: 'string'
                },
                {
                    key: 'day',
                    prompt: 'What day (in number form)?',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, { month, day }) {

        logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
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
            if (err.status === 404 || err.status === 500) return message.reply('Invalid date.');
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}