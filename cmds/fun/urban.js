const fetch = require('node-fetch');
module.exports = class UrbanCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'urban',
      group: 'fun',
      aliases: ['ud', 'urbandictionary'],
      memberName: 'urban',
      description: 'Get definitions from urban dictonary.',
      args: [
        {
          key: 'text',
          prompt: 'What do you want to search for?',
          type: 'string',
          validate: function validateTextLength(text) {
            return text.length < 50;
          }
        }
      ]
    });
  }

  run(message, { text }) {

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    fetch(`https://api.urbandictionary.com/v0/define?term=${text}`)
      .then(res => res.json())
      .then(json => {
        const embed = new Discord.MessageEmbed()
          .setColor('#BB7D61')
          .setTitle(`${text}`)
          .setAuthor(
            'Urban Dictionary',
            'https://i.imgur.com/vdoosDm.png',
            'https://urbandictionary.com'
          )
          .setDescription(
            `*${json.list[Math.floor(Math.random() * 1)].definition}*`
          )
          .setURL(json.list[0].permalink)
          .setTimestamp()
          .setFooter('Powered by UrbanDictionary', '');
        message.channel.send(embed);
        return;
      })
      .catch(() => {
        message.say('Failed to deliver definition :sob:');
        // console.error(err); // no need to spam console for each time it doesn't find a query
        return;
      });
  }
};