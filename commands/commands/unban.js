const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {
	
        let userID = args[0]
        msg.guild.fetchBans().then(bans=> {
        if(bans.size == 0) return 
        let bUser = bans.find(b => b.user.id == userID)
        if(!bUser) return
        msg.guild.members.unban(bUser.user)
        message.channel.send(`Unbanned!`)
    })
    }
}