const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async(client, message, args) => {
        
        const member = args[0];

        if (!member) {
             return channel.send(`Please enter a id!`)
        }

        try {
            message.guild.fetchBans().then(bans => {
                message.guild.members.unban(member)
            })
            await channel.send(`${member} has been unbanned!`)
        } catch (e) {
            return channel.send(`An error occured!`)
        }
    }
}