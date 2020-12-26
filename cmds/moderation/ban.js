module.exports = class BanCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      aliases: ['ban-member', 'ban-hammer'],
      memberName: 'ban',
      group: 'moderation',
      description: 'Bans a tagged member.',
      guildOnly: true,
      userPermissions: ['BAN_MEMBERS'],
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

    client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
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
          .setColor('#484848');
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