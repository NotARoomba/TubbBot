
module.exports = class KickCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      aliases: ['kick-member', 'throw'],
      memberName: 'kick',
      group: 'moderation',
      description: 'Kicks a tagged member.',
      guildOnly: true,
      userPermissions: ['KICK_MEMBERS'],
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

    logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
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
          .setColor('#484848');
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