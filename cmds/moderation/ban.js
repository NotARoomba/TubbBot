const { Command } = require('discord.js-commando');
module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      aliases: ['ban-member', 'ban-hammer'],
      memberName: 'ban',
      group: 'moderation',
      description: 'Bans a tagged member.',
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      args: [
        {
          key: 'userToBan',
          prompt:
            'Please mention the user you want to ban with @.',
          type: 'user'
        },
        {
          key: 'reason',
          prompt: 'Why do you want to ban this user?',
          type: 'string'
        },
      ]
    });
  }

  async run(message, { userToBan, reason }) {
    const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
        webhookClient.send(`Command: ${this.name} 
    Ran by: ${message.author.tag}
    Server: ${message.guild.name}
    Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    const user =
      message.mentions.members.first()
    if (user == undefined || 'all')
      return message.channel.send(':x: Please try again with a valid user.');
    user
      .ban({ reason: reason })
      .then(() => {
        const banEmbed = new Discord.MessageEmbed()
          .addField('Banned:', userToBan)
          .addField('Reason', reason)
          .setColor('#420626');
        message.channel.send(banEmbed);
      })
      .catch(err => {
        message.say(
          ':x: Something went wrong when trying to ban this user, I probably do not have the permission to ban him!'
        );
        return console.error(err);
      });
  }
};