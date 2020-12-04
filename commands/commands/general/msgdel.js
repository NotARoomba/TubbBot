
module.exports = {
    commands: 'msgdel',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    description: 'Mass (message) Genocide',
    async callback (message, arguments, text) {
        const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        webhookClient.send(`Command: msgdel 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
        message.delete();
            const fetched = await message.channel.messages.fetch({limit: 99});
            message.channel.bulkDelete(fetched);
            
    }
}