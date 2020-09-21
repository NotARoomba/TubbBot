const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {

    if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I can't do that")
    message.delete()
    try {
        message.guild.members.unban(bannedMember, {reason: reason})
        message.channel.send(`${bannedMember.tag} was readmitted.`)
    } catch(e) {
        console.log(e.message)
    }
}
}