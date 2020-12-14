module.exports = class SimJoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'simjoin',
      aliases: [`sj`],
      memberName: 'simjoin',
      group: 'config',
      description: `Simulate a join to test your welcome settings`,
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
    });
  }
  async run(message) {

    webhookClient.send(`Command: simjoin 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    client.emit('guildMemberAdd', message.member)
  }
}