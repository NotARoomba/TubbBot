const Discord = require('discord.js')
const client = new Discord.Client()


module.exports = {
    commands: 'msgdel',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    description: 'Mass (message) Genocide',
    async callback (message, arguments, text) {
        message.delete();
            const fetched = await message.channel.messages.fetch({limit: 99});
            message.channel.bulkDelete(fetched);
            
    }
}