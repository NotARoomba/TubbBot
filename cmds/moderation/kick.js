const { Command } = require('discord.js-commando');
module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      aliases: ['kick-member', 'throw'],
      memberName: 'kick',
      group: 'moderation',
      description: 'Kicks a tagged member.',
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      args: [
        {
          key: 'userToKick',
          prompt:
            'Please mention the user you want to kick with @.',
          type: 'user'
        },
        {
          key: 'reason',
          prompt: 'Why do you want to kick this user?',
          type: 'string'
        }
      ]
    });
  }

  async run(message, { userToKick, reason }) {
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    const user =
      message.mentions.members.first()
    if (user == undefined)
      return message.channel.send(':x: Please try again with a valid user.');
    user
      .kick(reason)
      .then(() => {
        const kickEmbed = new Discord.MessageEmbed()
          .addField('Kicked:', userToKick)
          .addField('Reason:', reason)
          .setColor('#420626');
        message.channel.send(kickEmbed);
      })
      .catch(err => {
        message.say(
          ':x: Something went wrong when trying to kick this user, I probably do not have the permission to kick him!'
        );
        return console.error(err);
      });
  }
};