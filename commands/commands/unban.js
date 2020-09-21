const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async(client, message, args) => {
        
        const member = args[0];

        if (!member) {
             return client.channels.get(channel).send(`Please enter a id!`)
        }

        try {
            message.guild.fetchBans().then(bans => {
                message.guild.members.unban(member)
            })
            await client.channels.get(channel).send(`${member} has been unbanned!`)
        } catch (e) {
            return client.channels.get(channel).send(`An error occured!`)
        }
    }
}