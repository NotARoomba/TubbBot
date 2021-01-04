module.exports = class messagedelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'messagedel',
            aliases: ['msgdel'],
            group: 'util',
            memberName: 'messagedel',
            description: 'Mass (message) Genocide',
            clientPermissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'count',
                    label: 'amount of messages',
                    prompt: 'How many messages do you want to delete? Limit of up to 100.',
                    type: 'integer',
                    min: 1,
                    max: 100,
                    default: 100
                }
            ],
            guildOnly: true,
        });
    }
    async run(message, { count }) {

        client.logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        count++;
        try {
            const messages = await message.channel.messages.fetch({ limit: count > 100 ? 100 : count });
            await message.channel.bulkDelete(messages, true);
            return null;
        } catch {
            return message.reply('There are no messages younger than two weeks that can be deleted.');
        }

    }
}