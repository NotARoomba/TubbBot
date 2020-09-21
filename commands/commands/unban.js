const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: (client, message, args) => {
        
           if(isNaN(args[0])) return message.channel.send("You need to provide an ID.")
    let bannedMember =  client.users.fetch(args[0])
        if(!bannedMember) return message.channel.send("Please provide a user id to unban someone!")

    let reason = args.slice(1).join(" ")
        if(!reason) reason = "No reason given!"

    if(!message.guild.me.hasPermission(["BAN_MEMBERS"])) return message.channel.send("I dont have permission to perform this command!")|
    message.delete()
    try {
        message.guild.members.unban(bannedMember, reason)
        message.channel.send(`**${bannedMember.tag}** has been unbanned from the guild!`)
    } catch(e) {
        console.log(e.message)
    }
    }
}