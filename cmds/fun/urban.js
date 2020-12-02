const fetch = require('node-fetch');
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('@root/config.json');
const Discord = require('discord.js');
module.exports = class UrbanCommand extends Command {
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
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}`)
    fetch(`https://api.urbandictionary.com/v0/define?term=${text}`)
      .then(res => res.json())
      .then(json => {
        const embed = new MessageEmbed()
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