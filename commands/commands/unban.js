const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {

        if(!args[0]) return message.channel.send("Give me a valid ID"); 
        //This if() checks if we typed anything after "!unban"
    
        let bannedMember;
        //This try...catch solves the problem with the await
        try{                                                            
            bannedMember = await client.users.fetch(args[0])
        }catch(e){
            if(!bannedMember) return message.channel.send("That's not a valid ID")
        }
    
        //Check if the user is not banned
        try {
                await message.guild.fetchBan(args[0])
            } catch(e){
                message.channel.send('This user is not banned.');
                return;
            }
    
        let reason = args.slice(1).join(" ")
        if(!reason) reason = "..."
    
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