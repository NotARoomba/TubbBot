const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {
        
        if(isNaN(args[0])) return message.channel.send("You need to provide an ID.")
        let bannedMember =  client.users.fetch(args[0])
            if(!bannedMember) return message.channel.send("Please provide a user id to unban someone!")
    
    
        try {
            message.guild.members.unban(bannedMember, reason)
            message.channel.send(`**${bannedMember.tag}** has been unbanned from the guild!`)
        } catch(e) {
            console.log(e.message)
        }
    }
}