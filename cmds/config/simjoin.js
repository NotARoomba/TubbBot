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

    logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
    client.emit('guildMemberAdd', message.member)
  }
}