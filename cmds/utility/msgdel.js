module.exports = class MsgdelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'msgdel',
            group: 'util',
            memberName: 'msgdel',
            description: 'Mass (message) Genocide',
            userPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
        });
    }
    async run(message) {

        webhookClient.send(`Command: msgdel 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
        message.delete();
        const fetched = await message.channel.messages.fetch({ limit: 99 });
        message.channel.bulkDelete(fetched);

    }
}