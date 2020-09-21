const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {

        let bannedMember = parseInt(args[0]);
        if(isNaN(bannedMember)) return message.channel.send("You need to give me a valid ID!");

    let reason = args.slice(1).join(' ');
        if(!reason) return reason = "No reason given.";
    
        if (!message.guild.members.get(bannedMember)) return message.reply("This user is not banned!")
    try {
        message.guild.members.unban(bannedMember, reason);
        message.channel.send(`Succesfully unbanned ${bannedMember}!`)
    } catch(e) {
        console.log(e.message);
    }
    }
}