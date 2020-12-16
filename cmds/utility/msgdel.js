module.exports = class MsgdelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'messagedel',
            group: 'util',
            memberName: 'messagedel',
            description: 'Mass (message) Genocide',
            userPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
        });
    }
    async run(message) {

        client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        message.delete();
        const fetched = await message.channel.messages.fetch({ limit: 99 });
        message.channel.bulkDelete(fetched);

    }
}